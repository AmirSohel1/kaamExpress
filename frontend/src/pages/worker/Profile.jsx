import React, { useState, useRef, useEffect } from "react";
import { getWorkerProfile, updateWorkerProfile } from "../../api/workerProfile";

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nameRef = useRef();

  // Load worker profile
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getWorkerProfile();
        const formatted = {
          _id: data._id,
          name: data.user?.name || "",
          email: data.user?.email || "",
          phone: data.user?.phone || "",
          skills: data.skills || [],
          experience: data.experience || 0,
          address: data.address || "",
          availability: data.availability || false,
          about: data.about || "",
        };

        setSaved(formatted);
        setForm({ ...formatted });
        setLoading(false);
      } catch (err) {
        console.error(err);
        let msg = "Failed to load profile.";
        if (err?.response) {
          if (err.response.status === 404) {
            msg =
              "Profile not found. You may not have a worker account or your profile is missing.";
          } else if (
            err.response.status === 401 ||
            err.response.status === 403
          ) {
            msg = "You are not authorized. Please log in as a worker.";
          } else {
            msg = `Error: ${err.response.status} ${err.response.statusText}`;
          }
        } else if (err?.message) {
          msg = err.message;
        }
        setError(msg);
        setLoading(false);
      }
    };
    load();
  }, []);

  // Auto-focus when switching to edit mode
  useEffect(() => {
    if (edit && nameRef.current) {
      nameRef.current.focus();
    }
  }, [edit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkills = (e) => {
    setForm((prev) => ({
      ...prev,
      skills: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  const handleSave = async () => {
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert("Invalid email format");
      return;
    }

    try {
      const updated = await updateWorkerProfile(form._id, {
        ...form,
        skills: form.skills.map((s) => s.trim()),
      });

      // flatten user fields again after update
      const merged = {
        ...form,
        ...(updated.user
          ? {
              name: updated.user.name,
              email: updated.user.email,
              phone: updated.user.phone,
            }
          : {}),
      };

      setSaved(merged);
      setForm(merged);
      setEdit(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setForm({ ...saved });
    setEdit(false);
  };

  if (loading)
    return <div className="text-gray-400 p-8">Loading profile...</div>;
  if (error)
    return (
      <div className="text-red-400 p-8">
        {error}
        {error.includes("not authorized") && (
          <div className="mt-2">
            <a
              href="/login"
              className="text-blue-400 underline hover:text-blue-300"
            >
              Go to Login
            </a>
          </div>
        )}
        {error.includes("not found") && (
          <div className="mt-2 text-sm text-gray-400">
            If you believe this is a mistake, please contact support.
          </div>
        )}
      </div>
    );

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col animate-fade-in-up">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[var(--accent)]">
        Worker Profile
      </h2>

      <div className="bg-[var(--secondary)] rounded-2xl p-4 sm:p-6 shadow flex flex-col gap-6">
        {/* Avatar + Name + Skills */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {form?.name?.[0] || "?"}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {edit ? (
              <input
                ref={nameRef}
                className="font-semibold text-lg bg-[var(--card)] rounded-xl px-3 py-1 text-white border border-gray-700 focus:outline-none w-full"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            ) : (
              <div className="font-semibold text-lg text-white">
                {saved.name}
              </div>
            )}
            <div className="text-gray-400 text-sm mt-1">
              Skills:{" "}
              {edit ? (
                <input
                  className="bg-[var(--card)] rounded-xl px-3 py-1 text-white border border-gray-700 focus:outline-none w-full mt-1"
                  name="skills"
                  value={form.skills.join(", ")}
                  onChange={handleSkills}
                />
              ) : (
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  {saved.skills.length > 0 ? (
                    saved.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[var(--card)] text-[var(--accent)] rounded-full text-xs font-semibold border border-[var(--accent)]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">
                      No skills added
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-gray-400 text-xs mb-1">Email</div>
            {edit ? (
              <input
                className="w-full bg-[var(--card)] rounded-xl px-3 py-2 text-white border border-gray-700 focus:outline-none"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            ) : (
              <div className="text-gray-200">{saved.email}</div>
            )}
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">Phone</div>
            {edit ? (
              <input
                className="w-full bg-[var(--card)] rounded-xl px-3 py-2 text-white border border-gray-700 focus:outline-none"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            ) : (
              <div className="text-gray-200">{saved.phone}</div>
            )}
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">Experience (years)</div>
            {edit ? (
              <input
                className="w-full bg-[var(--card)] rounded-xl px-3 py-2 text-white border border-gray-700 focus:outline-none"
                name="experience"
                type="number"
                min="0"
                value={form.experience}
                onChange={handleChange}
              />
            ) : (
              <div className="text-gray-200">{saved.experience}</div>
            )}
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">Address</div>
            {edit ? (
              <input
                className="w-full bg-[var(--card)] rounded-xl px-3 py-2 text-white border border-gray-700 focus:outline-none"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            ) : (
              <div className="text-gray-200">{saved.address}</div>
            )}
          </div>
        </div>

        {/* About */}
        <div>
          <div className="text-gray-400 text-xs mb-1">About</div>
          {edit ? (
            <textarea
              className="w-full bg-[var(--card)] rounded-xl px-3 py-2 text-white border border-gray-700 focus:outline-none"
              name="about"
              rows={3}
              value={form.about}
              onChange={handleChange}
            />
          ) : (
            <div className="text-gray-300 italic">
              {saved.about || "No description provided"}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <span className="text-gray-300 font-semibold">Availability:</span>
          {edit ? (
            <select
              name="availability"
              value={form.availability ? "online" : "offline"}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  availability: e.target.value === "online",
                }))
              }
              className="bg-[var(--card)] rounded-xl px-3 py-2 text-white border border-gray-700 focus:outline-none"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          ) : (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                saved.availability
                  ? "bg-green-900 text-green-300 border-green-400"
                  : "bg-gray-700 text-gray-300 border-gray-500"
              }`}
            >
              {saved.availability ? "Online" : "Offline"}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-4">
          {edit ? (
            <>
              <button
                type="button"
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[var(--card)] text-white font-semibold hover:bg-[var(--secondary)] border border-gray-700 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 shadow-md transition"
                onClick={handleSave}
              >
                Save
              </button>
            </>
          ) : (
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 shadow-md transition"
              onClick={() => setEdit(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
