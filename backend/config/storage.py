import posixpath
import uuid
from pathlib import Path
from urllib.request import urlopen

import cloudinary.api
import cloudinary.uploader
from cloudinary.exceptions import NotFound
from cloudinary.utils import cloudinary_url

from django.core.files.base import ContentFile
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible


@deconstructible
class CloudinaryMediaStorage(Storage):
    """
    CareerSync media storage.

    Images and PDFs are stored as Cloudinary image assets.
    Other documents such as DOC/DOCX are stored as raw assets.
    """

    PREFIX = "cld:"

    IMAGE_EXTENSIONS = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".bmp",
        ".tif",
        ".tiff",
        ".pdf",
    }


    def _decode_name(self, name):
        if not name.startswith(self.PREFIX):
            return None

        parts = name.split(":", 3)

        if len(parts) != 4:
            return None

        _, resource_type, file_format, public_id = parts

        return {
            "resource_type": resource_type,
            "format": file_format or None,
            "public_id": public_id,
        }


    def _save(self, name, content):
        normalized_name = name.replace("\\", "/")

        extension = Path(
            normalized_name
        ).suffix.lower()

        relative_folder = posixpath.dirname(
            normalized_name
        ).strip("/")

        folder = "careersync"

        if relative_folder:
            folder = (
                f"{folder}/"
                f"{relative_folder}"
            )

        unique_id = uuid.uuid4().hex


        if extension in self.IMAGE_EXTENSIONS:
            resource_type = "image"

            public_id = (
                f"{folder}/{unique_id}"
            )

            result = cloudinary.uploader.upload(
                content,
                resource_type=resource_type,
                public_id=public_id,
                overwrite=False,
            )

            file_format = (
                result.get("format")
                or extension.lstrip(".")
            )

            return (
                f"{self.PREFIX}"
                f"{resource_type}:"
                f"{file_format}:"
                f"{result['public_id']}"
            )


        resource_type = "raw"

        public_id = (
            f"{folder}/"
            f"{unique_id}{extension}"
        )

        result = cloudinary.uploader.upload(
            content,
            resource_type=resource_type,
            public_id=public_id,
            overwrite=False,
        )

        return (
            f"{self.PREFIX}"
            f"{resource_type}::"
            f"{result['public_id']}"
        )


    def url(self, name):
        decoded = self._decode_name(
            name
        )

        if not decoded:
            return f"/media/{name}"

        url, _ = cloudinary_url(
            decoded["public_id"],
            resource_type=(
                decoded["resource_type"]
            ),
            format=decoded["format"],
            secure=True,
        )

        return url


    def exists(self, name):
        decoded = self._decode_name(
            name
        )

        if not decoded:
            return False

        try:
            cloudinary.api.resource(
                decoded["public_id"],
                resource_type=(
                    decoded["resource_type"]
                ),
            )

            return True

        except NotFound:
            return False


    def delete(self, name):
        decoded = self._decode_name(
            name
        )

        if not decoded:
            return

        cloudinary.uploader.destroy(
            decoded["public_id"],
            resource_type=(
                decoded["resource_type"]
            ),
            invalidate=True,
        )


    def _open(self, name, mode="rb"):
        file_url = self.url(name)

        with urlopen(file_url) as response:
            data = response.read()

        return ContentFile(
            data,
            name=name,
        )