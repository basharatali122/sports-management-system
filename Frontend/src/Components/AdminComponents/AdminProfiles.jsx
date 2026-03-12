// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function AdminProfiles() {

//   const [profiles, setProfiles] = useState([]);
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   const fetchProfiles = async () => {

//     try {

//       const res = await axios.get(
//         "http://localhost:3000/profiles/",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       setProfiles(res.data.data);

//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }

//   };


//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     setSelectedProfile({
//       ...selectedProfile,
//       [name]: value
//     });

//   };


//   const updateProfile = async () => {

//     try {

//       await axios.put(
//         `http://localhost:3000/profiles/admin/${selectedProfile._id}`,
//         selectedProfile,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       alert("Profile updated");

//       setSelectedProfile(null);

//       fetchProfiles();

//     } catch (error) {
//       console.error(error);
//     }

//   };


//   if (loading) {
//     return (
//       <div className="text-center mt-20 text-xl">
//         Loading profiles...
//       </div>
//     );
//   }


//   return (

//     <div className="p-8">

//       <h1 className="text-2xl font-bold mb-6">
//         All User Profiles
//       </h1>


//       {/* TABLE */}

//       <div className="bg-white shadow rounded-lg overflow-hidden">

//         <table className="w-full text-left">

//           <thead className="bg-gray-100">

//             <tr>
//               <th className="p-3">User</th>
//               <th className="p-3">Location</th>
//               <th className="p-3">Phone</th>
//               <th className="p-3">Action</th>
//             </tr>

//           </thead>

//           <tbody>

//             {profiles.map((profile) => (

//               <tr
//                 key={profile._id}
//                 className="border-t"
//               >

//                 <td className="p-3">
//                   {profile.name || "User"}
//                 </td>

//                 <td className="p-3">
//                   {profile.location}
//                 </td>

//                 <td className="p-3">
//                   {profile.phone}
//                 </td>

//                 <td className="p-3">

//                   <button
//                     onClick={() => setSelectedProfile(profile)}
//                     className="bg-blue-600 text-white px-4 py-1 rounded"
//                   >
//                     Edit
//                   </button>

//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//       </div>



//       {/* EDIT MODAL */}

//       {selectedProfile && (

//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//           <div className="bg-white p-6 rounded-lg w-[500px]">

//             <h2 className="text-xl font-bold mb-4">
//               Edit Profile
//             </h2>


//             <div className="space-y-3">

//               <input
//                 name="bio"
//                 value={selectedProfile.bio || ""}
//                 onChange={handleChange}
//                 placeholder="Bio"
//                 className="w-full border p-2 rounded"
//               />

//               <input
//                 name="location"
//                 value={selectedProfile.location || ""}
//                 onChange={handleChange}
//                 placeholder="Location"
//                 className="w-full border p-2 rounded"
//               />

//               <input
//                 name="phone"
//                 value={selectedProfile.phone || ""}
//                 onChange={handleChange}
//                 placeholder="Phone"
//                 className="w-full border p-2 rounded"
//               />


//               {/* Participant fields */}

//               {selectedProfile.sportsPreferences && (

//                 <input
//                   name="sportsPreferences"
//                   value={selectedProfile.sportsPreferences}
//                   onChange={handleChange}
//                   placeholder="Sports Preferences"
//                   className="w-full border p-2 rounded"
//                 />

//               )}


//               {selectedProfile.pastParticipation && (

//                 <input
//                   name="pastParticipation"
//                   value={selectedProfile.pastParticipation}
//                   onChange={handleChange}
//                   placeholder="Past Participation"
//                   className="w-full border p-2 rounded"
//                 />

//               )}


//               {selectedProfile.achievements && (

//                 <input
//                   name="achievements"
//                   value={selectedProfile.achievements}
//                   onChange={handleChange}
//                   placeholder="Achievements"
//                   className="w-full border p-2 rounded"
//                 />

//               )}


//               {/* Coach fields */}

//               {selectedProfile.sportsExpertise && (

//                 <input
//                   name="sportsExpertise"
//                   value={selectedProfile.sportsExpertise}
//                   onChange={handleChange}
//                   placeholder="Sports Expertise"
//                   className="w-full border p-2 rounded"
//                 />

//               )}


//               {selectedProfile.teamsManaged && (

//                 <input
//                   name="teamsManaged"
//                   value={selectedProfile.teamsManaged}
//                   onChange={handleChange}
//                   placeholder="Teams Managed"
//                   className="w-full border p-2 rounded"
//                 />

//               )}


//               {selectedProfile.availability && (

//                 <input
//                   name="availability"
//                   value={selectedProfile.availability}
//                   onChange={handleChange}
//                   placeholder="Availability"
//                   className="w-full border p-2 rounded"
//                 />

//               )}

//             </div>


//             <div className="flex justify-end gap-3 mt-6">

//               <button
//                 onClick={() => setSelectedProfile(null)}
//                 className="bg-gray-400 text-white px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={updateProfile}
//                 className="bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 Save
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>

//   );

// }

// export default AdminProfiles;



import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminProfiles() {

  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [searchSport, setSearchSport] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sportFilter, setSportFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 10;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [profiles, searchName, searchSport, roleFilter, sportFilter]);

  const fetchProfiles = async () => {
    try {

      const res = await axios.get(
        "http://localhost:3000/profiles/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfiles(res.data.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {

    let data = [...profiles];

    if (searchName) {
      data = data.filter(p =>
        (p.name || "").toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchSport) {
      data = data.filter(p =>
        JSON.stringify(p).toLowerCase().includes(searchSport.toLowerCase())
      );
    }

    if (roleFilter) {
      data = data.filter(p => p.role === roleFilter);
    }

    if (sportFilter) {
      data = data.filter(p =>
        JSON.stringify(p).toLowerCase().includes(sportFilter.toLowerCase())
      );
    }

    setFilteredProfiles(data);
    setCurrentPage(1);
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setSelectedProfile({
      ...selectedProfile,
      [name]: value
    });

  };

  const updateProfile = async () => {

    try {

      await axios.put(
        `http://localhost:3000/profiles/admin/${selectedProfile._id}`,
        selectedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Profile updated");

      setSelectedProfile(null);
      fetchProfiles();

    } catch (error) {
      console.error(error);
    }

  };

  const totalProfiles = profiles.length;
  const participants = profiles.filter(p => p.role === "participant").length;
  const coaches = profiles.filter(p => p.role === "coach").length;

  const indexOfLast = currentPage * profilesPerPage;
  const indexOfFirst = indexOfLast - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl">
        Loading profiles...
      </div>
    );
  }

  return (

    <div className="p-8 space-y-6">

      <h1 className="text-2xl font-bold">
        All User Profiles
      </h1>


      {/* STATS */}

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
          <p>Total Profiles</p>
          <h2 className="text-2xl font-bold">{totalProfiles}</h2>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow">
          <p>Participants</p>
          <h2 className="text-2xl font-bold">{participants}</h2>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded-lg shadow">
          <p>Coaches</p>
          <h2 className="text-2xl font-bold">{coaches}</h2>
        </div>

      </div>


      {/* SEARCH + FILTER */}

      <div className="grid grid-cols-4 gap-4">

        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Search by sport"
          value={searchSport}
          onChange={(e) => setSearchSport(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="participant">Participant</option>
          <option value="coach">Coach</option>
        </select>

        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Sports</option>
          <option value="Cricket">Cricket</option>
          <option value="Football">Football</option>
        </select>

      </div>


      {/* TABLE */}

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Location</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
            </tr>

          </thead>

          <tbody>

            {currentProfiles.map((profile) => (

              <tr key={profile._id} className="border-t">

                <td className="p-3">
                  {profile.name || "User"}
                </td>

                <td className="p-3">
                  {profile.location}
                </td>

                <td className="p-3">
                  {profile.phone}
                </td>

                <td className="p-3 capitalize">
                  {profile.role}
                </td>

                <td className="p-3">

                  <button
                    onClick={() => setSelectedProfile(profile)}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* PAGINATION */}

      <div className="flex justify-between items-center">

        <p>
          Showing {currentProfiles.length} of {filteredProfiles.length} users
        </p>

        <div className="flex gap-2">

          {Array.from({ length: totalPages }, (_, i) => (

            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>

          ))}

        </div>

      </div>


      {/* EDIT MODAL */}

      {selectedProfile && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-lg w-[500px]">

            <h2 className="text-xl font-bold mb-4">
              Edit Profile
            </h2>

            <div className="space-y-3">

              <input
                name="bio"
                value={selectedProfile.bio || ""}
                onChange={handleChange}
                placeholder="Bio"
                className="w-full border p-2 rounded"
              />

              <input
                name="location"
                value={selectedProfile.location || ""}
                onChange={handleChange}
                placeholder="Location"
                className="w-full border p-2 rounded"
              />

              <input
                name="phone"
                value={selectedProfile.phone || ""}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border p-2 rounded"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setSelectedProfile(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={updateProfile}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default AdminProfiles;