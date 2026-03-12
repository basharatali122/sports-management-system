
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewProfile() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    }

    fetchProfile();

  }, []);

  const fetchProfile = async () => {
    try {

      const res = await axios.get(
        "http://localhost:3000/profiles/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(res.data.data);

    } catch (error) {

      console.error("Error fetching profile:", error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading profile...
      </div>
    );
  }

  if (!profile || Object.keys(profile).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        No profile found. Please update your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl p-8">

        {/* Header */}
        <div className="flex items-center gap-6 border-b pb-6">

          <img
            src={
              profile.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {profile.name || "User"}
            </h1>

            <p className="text-gray-500">{profile.location || "No location"}</p>

            <p className="text-gray-500">{profile.phone || "No phone"}</p>
          </div>

        </div>


        {/* BIO */}
        <div className="mt-6">

          <h2 className="text-lg font-semibold text-gray-700">Bio</h2>

          <p className="text-gray-600 mt-1">
            {profile.bio || "No bio provided"}
          </p>

        </div>


        {/* PARTICIPANT SECTION */}

        {role === "participant" && (

          <div className="mt-6 space-y-6">

            {/* Sports Preferences */}
            <div>

              <h2 className="text-lg font-semibold text-gray-700">
                Sports Preferences
              </h2>

              <div className="flex flex-wrap gap-2 mt-2">

                {profile.sportsPreferences?.length > 0
                  ? profile.sportsPreferences.map((sport, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {sport}
                      </span>
                    ))
                  : "No preferences added"}

              </div>

            </div>


            {/* Past Participation */}
            <div>

              <h2 className="text-lg font-semibold text-gray-700">
                Past Participation
              </h2>

              {profile.pastParticipation?.length > 0 ? (

                <ul className="list-disc list-inside text-gray-600">

                  {profile.pastParticipation.map((event, index) => (
                    <li key={index}>{event}</li>
                  ))}

                </ul>

              ) : (
                <p className="text-gray-500">No participation history</p>
              )}

            </div>


            {/* Achievements */}
            <div>

              <h2 className="text-lg font-semibold text-gray-700">
                Achievements
              </h2>

              {profile.achievements?.length > 0 ? (

                <ul className="list-disc list-inside text-gray-600">

                  {profile.achievements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}

                </ul>

              ) : (
                <p className="text-gray-500">No achievements added</p>
              )}

            </div>

          </div>

        )}


        {/* COACH SECTION */}

        {role === "coach" && (

          <div className="mt-6 space-y-6">

            {/* Sports Expertise */}
            <div>

              <h2 className="text-lg font-semibold text-gray-700">
                Sports Expertise
              </h2>

              <p className="text-gray-600">
                {profile.sportsExpertise || "Not specified"}
              </p>

            </div>


            {/* Teams Managed */}
            <div>

              <h2 className="text-lg font-semibold text-gray-700">
                Teams Managed
              </h2>

              {profile.teamsManaged?.length > 0 ? (

                <ul className="list-disc list-inside text-gray-600">

                  {profile.teamsManaged.map((team, index) => (
                    <li key={index}>{team}</li>
                  ))}

                </ul>

              ) : (
                <p className="text-gray-500">No teams managed</p>
              )}

            </div>


            {/* Availability */}
            <div>

              <h2 className="text-lg font-semibold text-gray-700">
                Availability
              </h2>

              <p className="text-gray-600">
                {profile.availability || "Not specified"}
              </p>

            </div>

          </div>

        )}


        {/* EDIT BUTTON */}

        <div className="mt-8 flex justify-end">

          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            Edit Profile
          </button>

        </div>

      </div>

    </div>
  );
}

export default ViewProfile;