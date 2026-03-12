from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.profile_controller import *
from app.middleware.auth import role

profile_bp = Blueprint("profiles", __name__)

# =========================
# USER ROUTES
# =========================

@profile_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_profile_route():
    return get_my_profile()


@profile_bp.route("/update", methods=["PUT"])
@jwt_required()
def update_profile_route():
    return update_profile()


# =========================
# ADMIN ROUTES
# =========================

@profile_bp.route("/", methods=["GET"])
@jwt_required()
@role("admin")
def get_all_profiles_route():
    return get_all_profiles()


@profile_bp.route("/<profile_id>", methods=["PUT"])
@jwt_required()
@role("admin")
def admin_update_profile_route(profile_id):
    return admin_update_profile(profile_id)