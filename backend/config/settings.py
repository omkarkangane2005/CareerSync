"""
Django settings for CareerSync.
"""

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv


# =========================================================
# BASE
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


def env_bool(name, default=False):
    value = os.getenv(
        name,
        str(default),
    )

    return value.strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }


def env_list(name, default=""):
    return [
        value.strip()
        for value in os.getenv(
            name,
            default,
        ).split(",")
        if value.strip()
    ]


# =========================================================
# CORE SECURITY
# =========================================================

SECRET_KEY = os.environ[
    "DJANGO_SECRET_KEY"
]

DEBUG = env_bool(
    "DJANGO_DEBUG",
    False,
)


ALLOWED_HOSTS = env_list(
    "DJANGO_ALLOWED_HOSTS",
    "localhost,127.0.0.1",
)


# Render automatically provides this hostname.
RENDER_EXTERNAL_HOSTNAME = os.getenv(
    "RENDER_EXTERNAL_HOSTNAME"
)

if (
    RENDER_EXTERNAL_HOSTNAME
    and RENDER_EXTERNAL_HOSTNAME
    not in ALLOWED_HOSTS
):
    ALLOWED_HOSTS.append(
        RENDER_EXTERNAL_HOSTNAME
    )


# =========================================================
# APPLICATIONS
# =========================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",
    "rest_framework",

    "accounts",
    "api",
]


# =========================================================
# MIDDLEWARE
# =========================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    "whitenoise.middleware.WhiteNoiseMiddleware",

    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# =========================================================
# URL / WSGI
# =========================================================

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"


# =========================================================
# TEMPLATES
# =========================================================

TEMPLATES = [
    {
        "BACKEND":
            "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# =========================================================
# DATABASE
# =========================================================

DB_ENGINE = os.getenv(
    "DB_ENGINE",
    "sqlite",
).lower()


if DB_ENGINE == "postgresql":

    database_options = {}

    db_sslmode = os.getenv(
        "DB_SSLMODE",
        "",
    ).strip()

    if db_sslmode:
        database_options[
            "sslmode"
        ] = db_sslmode


    DATABASES = {
        "default": {
            "ENGINE":
                "django.db.backends.postgresql",

            "NAME":
                os.environ["DB_NAME"],

            "USER":
                os.environ["DB_USER"],

            "PASSWORD":
                os.environ["DB_PASSWORD"],

            "HOST":
                os.environ["DB_HOST"],

            "PORT":
                os.getenv(
                    "DB_PORT",
                    "5432",
                ),

            "CONN_MAX_AGE":
                60,

            "OPTIONS":
                database_options,
        }
    }

else:

    DATABASES = {
        "default": {
            "ENGINE":
                "django.db.backends.sqlite3",

            "NAME":
                BASE_DIR / "db.sqlite3",
        }
    }


# =========================================================
# CUSTOM USER
# =========================================================

AUTH_USER_MODEL = "accounts.User"


# =========================================================
# PASSWORD VALIDATION
# =========================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME":
            "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME":
            "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME":
            "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME":
            "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# =========================================================
# INTERNATIONALIZATION
# =========================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# =========================================================
# CORS
# =========================================================

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    (
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    ),
)


# =========================================================
# CSRF
# =========================================================

CSRF_TRUSTED_ORIGINS = env_list(
    "CSRF_TRUSTED_ORIGINS",
    (
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    ),
)


# =========================================================
# DJANGO REST FRAMEWORK
# =========================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}


# =========================================================
# JWT
# =========================================================

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":
        timedelta(minutes=30),

    "REFRESH_TOKEN_LIFETIME":
        timedelta(days=1),
}


# =========================================================
# STATIC FILES
# =========================================================

STATIC_URL = "/static/"

STATIC_ROOT = (
    BASE_DIR / "staticfiles"
)


STORAGES = {
    "default": {
        "BACKEND":
            "django.core.files.storage.FileSystemStorage",
    },

    "staticfiles": {
        "BACKEND":
            "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


# =========================================================
# MEDIA FILES
# =========================================================

MEDIA_URL = "/media/"

MEDIA_ROOT = (
    BASE_DIR / "media"
)


# =========================================================
# EMAIL
# =========================================================

if DEBUG:

    MAILERS = {
        "default": {
            "BACKEND":
                "django.core.mail.backends.console.EmailBackend",
        },
    }

else:

    MAILERS = {
        "default": {
            "BACKEND":
                "django.core.mail.backends.smtp.EmailBackend",

            "OPTIONS": {
                "host":
                    os.getenv(
                        "SMTP_HOST",
                        "localhost",
                    ),

                "port":
                    int(
                        os.getenv(
                            "SMTP_PORT",
                            "587",
                        )
                    ),

                "username":
                    os.getenv(
                        "SMTP_USERNAME",
                        "",
                    ),

                "password":
                    os.getenv(
                        "SMTP_PASSWORD",
                        "",
                    ),

                "use_tls":
                    env_bool(
                        "SMTP_USE_TLS",
                        True,
                    ),

                "timeout":
                    10,
            },
        },
    }


# =========================================================
# PRODUCTION SECURITY
# =========================================================

if DEBUG:

    SECURE_SSL_REDIRECT = False

    SESSION_COOKIE_SECURE = False

    CSRF_COOKIE_SECURE = False

    SECURE_HSTS_SECONDS = 0

    SECURE_HSTS_INCLUDE_SUBDOMAINS = False

    SECURE_HSTS_PRELOAD = False


else:

    # Render terminates HTTPS at its proxy and forwards
    # X-Forwarded-Proto to Django.
    SECURE_PROXY_SSL_HEADER = (
        "HTTP_X_FORWARDED_PROTO",
        "https",
    )

    SECURE_SSL_REDIRECT = env_bool(
        "SECURE_SSL_REDIRECT",
        True,
    )

    SESSION_COOKIE_SECURE = True

    CSRF_COOKIE_SECURE = True


    SECURE_HSTS_SECONDS = int(
        os.getenv(
            "SECURE_HSTS_SECONDS",
            "3600",
        )
    )


    SECURE_HSTS_INCLUDE_SUBDOMAINS = (
        env_bool(
            "SECURE_HSTS_INCLUDE_SUBDOMAINS",
            False,
        )
    )


    SECURE_HSTS_PRELOAD = env_bool(
        "SECURE_HSTS_PRELOAD",
        False,
    )