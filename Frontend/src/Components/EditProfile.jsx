
import React, { useState, useEffect } from "react";
import axios from "axios";

function EditProfile() {

  const token = localStorage.getItem("token");

  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    phone: "",

    // participant
    sportsPreferences: "",
    pastParticipation: "",
    achievements: "",

    // coach
    sportsExpertise: "",
    teamsManaged: "",
    availability: ""
  });

  const [loading, setLoading] = useState(false);

  // decode JWT to get role
  useEffect(() => {

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    }

  }, [token]);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      let data = {
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone
      };

      // PARTICIPANT DATA
      if (role === "participant") {

        data = {
          ...data,
          sportsPreferences: formData.sportsPreferences
            ? formData.sportsPreferences.split(",").map(i => i.trim())
            : [],

          pastParticipation: formData.pastParticipation
            ? formData.pastParticipation.split(",").map(i => i.trim())
            : [],

          achievements: formData.achievements
            ? formData.achievements.split(",").map(i => i.trim())
            : []
        };

      }

      // COACH DATA
      if (role === "coach") {

        data = {
          ...data,
          sportsExpertise: formData.sportsExpertise,
          teamsManaged: formData.teamsManaged
            ? formData.teamsManaged.split(",").map(i => i.trim())
            : [],
          availability: formData.availability
        };

      }

      await axios.put(
        "http://localhost:3000/profiles/update",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Profile updated successfully!");

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.error ||
        "Failed to update profile"
      );

    } finally {
      setLoading(false);
    }

  };


  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl p-8">

        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* BIO */}
          <div>
            <label className="block font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>


          {/* ================= PARTICIPANT FIELDS ================= */}

          {role === "participant" && (

            <>
              <div>
                <label className="block font-medium mb-1">
                  Sports Preferences
                </label>

                <input
                  type="text"
                  name="sportsPreferences"
                  value={formData.sportsPreferences}
                  onChange={handleChange}
                  placeholder="Cricket, Football"
                  className="w-full border p-2 rounded-lg"
                />
              </div>


              <div>
                <label className="block font-medium mb-1">
                  Past Participation
                </label>

                <input
                  type="text"
                  name="pastParticipation"
                  value={formData.pastParticipation}
                  onChange={handleChange}
                  placeholder="Tournament 2024"
                  className="w-full border p-2 rounded-lg"
                />
              </div>


              <div>
                <label className="block font-medium mb-1">
                  Achievements
                </label>

                <input
                  type="text"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  placeholder="Best Player"
                  className="w-full border p-2 rounded-lg"
                />
              </div>

            </>

          )}


          {/* ================= COACH FIELDS ================= */}

          {role === "coach" && (

            <>

              <div>
                <label className="block font-medium mb-1">
                  Sports Expertise
                </label>

                <select
                  name="sportsExpertise"
                  value={formData.sportsExpertise}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="">Select Sport</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Badminton">Badminton</option>
                </select>
              </div>


              <div>
                <label className="block font-medium mb-1">
                  Teams Managed
                </label>

                <input
                  type="text"
                  name="teamsManaged"
                  value={formData.teamsManaged}
                  onChange={handleChange}
                  placeholder="Team A, Team B"
                  className="w-full border p-2 rounded-lg"
                />
              </div>


              <div>
                <label className="block font-medium mb-1">
                  Availability
                </label>

                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="Weekends / Evenings"
                  className="w-full border p-2 rounded-lg"
                />
              </div>

            </>

          )}


          {/* SUBMIT BUTTON */}

          <div className="flex justify-end">

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default EditProfile;