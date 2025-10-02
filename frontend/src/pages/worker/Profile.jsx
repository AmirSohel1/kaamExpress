import React, { useState, useEffect, useRef } from "react";
import { getWorkerProfile, updateWorkerProfile } from "../../api/workerProfile";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const shifts = ["Morning", "Afternoon", "Evening"];
const transportOptions = ["Own Vehicle", "Public Transport", "Walk"];
const healthStatusOptions = [
  "Fit",
  "Injured",
  "Recovering",
  "Limited Capacity",
];

const Profile = () => {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("basic");

  const nameRef = useRef();

  useEffect(() => {
    const controller = new AbortController();
    const loadProfile = async () => {
      try {
        const data = await getWorkerProfile({ signal: controller.signal });
        setForm(data);
        setSaved(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (edit && nameRef.current) nameRef.current.focus();
  }, [edit]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (field, key, value) => {
    setForm((prev) => ({ ...prev, [field]: { ...prev[field], [key]: value } }));
  };

  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = [...form[field]];
    updatedArray[index][key] = value;
    setForm((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayItem = (field) => {
    let newItem = {};
    if (field === "certifications")
      newItem = {
        name: "",
        issuedBy: "",
        year: new Date().getFullYear(),
        documentUrl: "",
      };
    if (field === "previousJobs")
      newItem = { company: "", role: "", duration: "", description: "" };
    if (field === "injuryHistory")
      newItem = {
        date: new Date().toISOString().substring(0, 10),
        description: "",
      };
    if (field === "emergencyContacts")
      newItem = { name: "", phone: "", relation: "" };
    if (field === "ratings")
      newItem = { customer: "", stars: 5, comment: "", date: new Date() };
    setForm((prev) => ({ ...prev, [field]: [...prev[field], newItem] }));
  };

  const removeArrayItem = (field, index) => {
    const updated = [...form[field]];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  const toggleArrayValue = (field, value) => {
    const updated = form[field].includes(value)
      ? form[field].filter((v) => v !== value)
      : [...form[field], value];
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  const handleSave = async () => {
    try {
      const updated = await updateWorkerProfile(form._id, form);
      setSaved(updated);
      setForm(updated);
      setEdit(false);
      alert("Profile updated successfully");
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
    return <div className="p-8 text-gray-400">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[var(--accent)]">
        Worker Profile
      </h2>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-2">
        {[
          "basic",
          "skills",
          "availability",
          "location",
          "health",
          "documents",
          "emergency",
        ].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-t-lg ${
              activeSection === section
                ? "bg-[var(--accent)] text-black"
                : "bg-[var(--card)] hover:bg-gray-700"
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-[var(--secondary)] p-6 rounded-2xl shadow flex flex-col gap-6">
        {/* Basic Info Section */}
        {activeSection === "basic" && (
          <>
            <h3 className="text-xl font-semibold text-[var(--accent)] border-b border-gray-700 pb-2">
              Basic Information
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center text-3xl font-bold text-white">
                {form.user?.name?.[0] || "?"}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs">Full Name</label>
                  {edit ? (
                    <input
                      ref={nameRef}
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.user?.name || ""}
                      onChange={(e) =>
                        handleNestedChange("user", "name", e.target.value)
                      }
                    />
                  ) : (
                    <div className="font-medium">{form.user?.name}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Email</label>
                  <div className="text-gray-400">{form.user?.email}</div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Phone</label>
                  {edit ? (
                    <input
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.user?.phone || ""}
                      onChange={(e) =>
                        handleNestedChange("user", "phone", e.target.value)
                      }
                    />
                  ) : (
                    <div className="text-gray-400">{form.user?.phone}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Gender</label>
                  {edit ? (
                    <select
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.user?.gender || "other"}
                      onChange={(e) =>
                        handleNestedChange("user", "gender", e.target.value)
                      }
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div className="capitalize">
                      {form.user?.gender || "Other"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs">Address</label>
                {edit ? (
                  <input
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                ) : (
                  <div>{form.address}</div>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs">
                  Experience (years)
                </label>
                {edit ? (
                  <input
                    type="number"
                    min={0}
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                    value={form.experience}
                    onChange={(e) =>
                      handleChange("experience", Number(e.target.value))
                    }
                  />
                ) : (
                  <div>{form.experience}</div>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs">Daily Rate ($)</label>
                {edit ? (
                  <input
                    type="number"
                    min={0}
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                    value={form.dailyRate}
                    onChange={(e) =>
                      handleChange("dailyRate", Number(e.target.value))
                    }
                  />
                ) : (
                  <div>${form.dailyRate}</div>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs">
                  Max Hours Per Day
                </label>
                {edit ? (
                  <input
                    type="number"
                    min={1}
                    max={24}
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                    value={form.maxHoursPerDay}
                    onChange={(e) =>
                      handleChange("maxHoursPerDay", Number(e.target.value))
                    }
                  />
                ) : (
                  <div>{form.maxHoursPerDay} hours</div>
                )}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs">Bio</label>
              {edit ? (
                <textarea
                  className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                  rows="3"
                  value={form.user?.bio || ""}
                  onChange={(e) =>
                    handleNestedChange("user", "bio", e.target.value)
                  }
                />
              ) : (
                <div>{form.user?.bio || "No bio provided"}</div>
              )}
            </div>
          </>
        )}

        {/* Skills Section */}
        {activeSection === "skills" && (
          <>
            <h3 className="text-xl font-semibold text-[var(--accent)] border-b border-gray-700 pb-2">
              Skills & Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs">Primary Skill</label>
                {edit ? (
                  <input
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                    value={form.primarySkill}
                    onChange={(e) =>
                      handleChange("primarySkill", e.target.value)
                    }
                  />
                ) : (
                  <div>{form.primarySkill || "N/A"}</div>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs">Services</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {form.services && form.services.length > 0
                    ? form.services.map((service, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[var(--card)] text-[var(--accent)] rounded-full text-xs"
                        >
                          {service}
                        </span>
                      ))
                    : "No services added"}
                </div>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1">
                Custom Skills
              </label>
              {edit ? (
                <input
                  className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                  value={form.customSkills.join(", ")}
                  onChange={(e) =>
                    handleChange(
                      "customSkills",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="Enter skills separated by commas"
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {form.customSkills.length > 0
                    ? form.customSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[var(--card)] text-[var(--accent)] rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))
                    : "No skills added"}
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1">
                Secondary Skills
              </label>
              {edit ? (
                <input
                  className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                  value={form.secondarySkills.join(", ")}
                  onChange={(e) =>
                    handleChange(
                      "secondarySkills",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="Enter skills separated by commas"
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {form.secondarySkills.length > 0
                    ? form.secondarySkills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[var(--card)] text-[var(--accent)] rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))
                    : "No secondary skills"}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 text-xs">Certifications</label>
                {edit && (
                  <button
                    onClick={() => addArrayItem("certifications")}
                    className="text-xs bg-[var(--accent)] text-black px-2 py-1 rounded"
                  >
                    + Add
                  </button>
                )}
              </div>
              {form.certifications.length === 0 ? (
                <div className="text-gray-500 italic">
                  No certifications added
                </div>
              ) : (
                <div className="space-y-3">
                  {form.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="bg-[var(--card)] p-3 rounded-lg"
                    >
                      {edit ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-gray-400 text-xs">
                              Name
                            </label>
                            <input
                              className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                              value={cert.name}
                              onChange={(e) =>
                                handleArrayChange(
                                  "certifications",
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">
                              Issued By
                            </label>
                            <input
                              className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                              value={cert.issuedBy}
                              onChange={(e) =>
                                handleArrayChange(
                                  "certifications",
                                  index,
                                  "issuedBy",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">
                              Year
                            </label>
                            <input
                              type="number"
                              className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                              value={cert.year}
                              onChange={(e) =>
                                handleArrayChange(
                                  "certifications",
                                  index,
                                  "year",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">
                              Document URL
                            </label>
                            <input
                              className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                              value={cert.documentUrl}
                              onChange={(e) =>
                                handleArrayChange(
                                  "certifications",
                                  index,
                                  "documentUrl",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <button
                              onClick={() =>
                                removeArrayItem("certifications", index)
                              }
                              className="text-red-500 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <div>
                            <div className="text-gray-400 text-xs">Name</div>
                            <div>{cert.name}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-xs">
                              Issued By
                            </div>
                            <div>{cert.issuedBy}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-xs">Year</div>
                            <div>{cert.year}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-xs">
                              Document
                            </div>
                            <div className="truncate">
                              {cert.documentUrl || "N/A"}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 text-xs">Previous Jobs</label>
                {edit && (
                  <button
                    onClick={() => addArrayItem("previousJobs")}
                    className="text-xs bg-[var(--accent)] text-black px-2 py-1 rounded"
                  >
                    + Add
                  </button>
                )}
              </div>
              {form.previousJobs.length === 0 ? (
                <div className="text-gray-500 italic">
                  No previous jobs added
                </div>
              ) : (
                <div className="space-y-3">
                  {form.previousJobs.map((job, index) => (
                    <div
                      key={index}
                      className="bg-[var(--card)] p-3 rounded-lg"
                    >
                      {edit ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-gray-400 text-xs">
                              Company
                            </label>
                            <input
                              className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                              value={job.company}
                              onChange={(e) =>
                                handleArrayChange(
                                  "previousJobs",
                                  index,
                                  "company",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">
                              Role
                            </label>
                            <input
                              className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                              value={job.role}
                              onChange={(e) =>
                                handleArrayChange(
                                  "previousJobs",
                                  index,
                                  "role",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">
                              Duration
                            </label>
                            <input
                              className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                              value={job.duration}
                              onChange={(e) =>
                                handleArrayChange(
                                  "previousJobs",
                                  index,
                                  "duration",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-gray-400 text-xs">
                              Description
                            </label>
                            <textarea
                              className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                              rows="2"
                              value={job.description}
                              onChange={(e) =>
                                handleArrayChange(
                                  "previousJobs",
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <button
                              onClick={() =>
                                removeArrayItem("previousJobs", index)
                              }
                              className="text-red-500 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium">
                            {job.role} at {job.company}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {job.duration}
                          </div>
                          <div className="mt-1">{job.description}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Availability Section */}
        {activeSection === "availability" && (
          <>
            <h3 className="text-xl font-semibold text-[var(--accent)] border-b border-gray-700 pb-2">
              Availability & Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs">Work Days</label>
                {edit ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {weekdays.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleArrayValue("workDays", day)}
                        className={`px-2 py-1 rounded-full text-xs border ${
                          form.workDays.includes(day)
                            ? "bg-green-600 border-green-500"
                            : "bg-[var(--card)] border-gray-700"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {form.workDays.length > 0
                      ? form.workDays.map((day) => (
                          <span
                            key={day}
                            className="px-2 py-1 bg-[var(--card)] rounded-full text-xs"
                          >
                            {day.substring(0, 3)}
                          </span>
                        ))
                      : "No work days selected"}
                  </div>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs">
                  Available Shifts
                </label>
                {edit ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {shifts.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleArrayValue("availableShifts", s)}
                        className={`px-2 py-1 rounded-full text-xs border ${
                          form.availableShifts.includes(s)
                            ? "bg-green-600 border-green-500"
                            : "bg-[var(--card)] border-gray-700"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {form.availableShifts.length > 0
                      ? form.availableShifts.map((shift) => (
                          <span
                            key={shift}
                            className="px-2 py-1 bg-[var(--card)] rounded-full text-xs"
                          >
                            {shift}
                          </span>
                        ))
                      : "No shifts selected"}
                  </div>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs">
                  Work Preferences
                </label>
                {edit ? (
                  <input
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                    value={form.workPreferences.join(", ")}
                    onChange={(e) =>
                      handleChange(
                        "workPreferences",
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    placeholder="Enter preferences separated by commas"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {form.workPreferences.length > 0
                      ? form.workPreferences.map((pref, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-[var(--card)] text-[var(--accent)] rounded-full text-xs"
                          >
                            {pref}
                          </span>
                        ))
                      : "No preferences specified"}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <label className="text-gray-400 text-xs">
                  Availability Status
                </label>
                {edit ? (
                  <select
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white"
                    value={form.availability ? "online" : "offline"}
                    onChange={(e) =>
                      handleChange("availability", e.target.value === "online")
                    }
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 rounded-full text-xs border ${
                      form.availability
                        ? "bg-green-600 border-green-500"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  >
                    {form.availability ? "Online" : "Offline"}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* Location Section */}
        {activeSection === "location" && (
          <>
            <h3 className="text-xl font-semibold text-[var(--accent)] border-b border-gray-700 pb-2">
              Location & Transport
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs">Transport Mode</label>
                {edit ? (
                  <select
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 w-full text-white"
                    value={form.transportMode}
                    onChange={(e) =>
                      handleChange("transportMode", e.target.value)
                    }
                  >
                    {transportOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div>{form.transportMode}</div>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs">
                  Distance Willing to Travel (km)
                </label>
                {edit ? (
                  <input
                    type="number"
                    min={0}
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                    value={form.distanceWillingToTravel}
                    onChange={(e) =>
                      handleChange(
                        "distanceWillingToTravel",
                        Number(e.target.value)
                      )
                    }
                  />
                ) : (
                  <div>{form.distanceWillingToTravel} km</div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2">Working Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs">Street</label>
                  {edit ? (
                    <input
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.workingAvailableAddress.street}
                      onChange={(e) =>
                        handleNestedChange(
                          "workingAvailableAddress",
                          "street",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div>{form.workingAvailableAddress.street || "N/A"}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs">City</label>
                  {edit ? (
                    <input
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.workingAvailableAddress.city}
                      onChange={(e) =>
                        handleNestedChange(
                          "workingAvailableAddress",
                          "city",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div>{form.workingAvailableAddress.city || "N/A"}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs">State</label>
                  {edit ? (
                    <input
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.workingAvailableAddress.state}
                      onChange={(e) =>
                        handleNestedChange(
                          "workingAvailableAddress",
                          "state",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div>{form.workingAvailableAddress.state || "N/A"}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs">ZIP Code</label>
                  {edit ? (
                    <input
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.workingAvailableAddress.zip}
                      onChange={(e) =>
                        handleNestedChange(
                          "workingAvailableAddress",
                          "zip",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div>{form.workingAvailableAddress.zip || "N/A"}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Country</label>
                  {edit ? (
                    <input
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.workingAvailableAddress.country}
                      onChange={(e) =>
                        handleNestedChange(
                          "workingAvailableAddress",
                          "country",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div>{form.workingAvailableAddress.country || "N/A"}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Range (km)</label>
                  {edit ? (
                    <input
                      type="number"
                      min={0}
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.workingAvailableAddress.range}
                      onChange={(e) =>
                        handleNestedChange(
                          "workingAvailableAddress",
                          "range",
                          Number(e.target.value)
                        )
                      }
                    />
                  ) : (
                    <div>{form.workingAvailableAddress.range} km</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2">Location Coordinates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs">Latitude</label>
                  {edit ? (
                    <input
                      type="number"
                      step="any"
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={
                        form.workingAvailableAddress.location.coordinates[1] ||
                        0
                      }
                      onChange={(e) => {
                        const newCoords = [
                          ...form.workingAvailableAddress.location.coordinates,
                        ];
                        newCoords[1] = Number(e.target.value);
                        handleNestedChange(
                          "workingAvailableAddress",
                          "location",
                          {
                            ...form.workingAvailableAddress.location,
                            coordinates: newCoords,
                          }
                        );
                      }}
                    />
                  ) : (
                    <div>
                      {form.workingAvailableAddress.location.coordinates[1] ||
                        0}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Longitude</label>
                  {edit ? (
                    <input
                      type="number"
                      step="any"
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={
                        form.workingAvailableAddress.location.coordinates[0] ||
                        0
                      }
                      onChange={(e) => {
                        const newCoords = [
                          ...form.workingAvailableAddress.location.coordinates,
                        ];
                        newCoords[0] = Number(e.target.value);
                        handleNestedChange(
                          "workingAvailableAddress",
                          "location",
                          {
                            ...form.workingAvailableAddress.location,
                            coordinates: newCoords,
                          }
                        );
                      }}
                    />
                  ) : (
                    <div>
                      {form.workingAvailableAddress.location.coordinates[0] ||
                        0}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Health Section */}
        {activeSection === "health" && (
          <>
            <h3 className="text-xl font-semibold text-[var(--accent)] border-b border-gray-700 pb-2">
              Health & Insurance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs">Health Status</label>
                {edit ? (
                  <select
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 w-full text-white"
                    value={form.healthStatus}
                    onChange={(e) =>
                      handleChange("healthStatus", e.target.value)
                    }
                  >
                    {healthStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div>{form.healthStatus}</div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2">
                Insurance Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-xs">Provider</label>
                  {edit ? (
                    <input
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.insurance.provider}
                      onChange={(e) =>
                        handleNestedChange(
                          "insurance",
                          "provider",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div>{form.insurance.provider || "N/A"}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Policy Number</label>
                  {edit ? (
                    <input
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.insurance.policyNumber}
                      onChange={(e) =>
                        handleNestedChange(
                          "insurance",
                          "policyNumber",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div>{form.insurance.policyNumber || "N/A"}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Coverage</label>
                  {edit ? (
                    <input
                      className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                      value={form.insurance.coverage}
                      onChange={(e) =>
                        handleNestedChange(
                          "insurance",
                          "coverage",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div>{form.insurance.coverage || "N/A"}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium">Injury History</h4>
                {edit && (
                  <button
                    onClick={() => addArrayItem("injuryHistory")}
                    className="text-xs bg-[var(--accent)] text-black px-2 py-1 rounded"
                  >
                    + Add
                  </button>
                )}
              </div>
              {form.injuryHistory.length === 0 ? (
                <div className="text-gray-500 italic">
                  No injury history recorded
                </div>
              ) : (
                <div className="space-y-3">
                  {form.injuryHistory.map((injury, index) => (
                    <div
                      key={index}
                      className="bg-[var(--card)] p-3 rounded-lg"
                    >
                      {edit ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-gray-400 text-xs">
                              Date
                            </label>
                            <input
                              type="date"
                              className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                              value={injury.date.substring(0, 10)}
                              onChange={(e) =>
                                handleArrayChange(
                                  "injuryHistory",
                                  index,
                                  "date",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-gray-400 text-xs">
                              Description
                            </label>
                            <textarea
                              className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                              rows="2"
                              value={injury.description}
                              onChange={(e) =>
                                handleArrayChange(
                                  "injuryHistory",
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <button
                              onClick={() =>
                                removeArrayItem("injuryHistory", index)
                              }
                              className="text-red-500 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium">
                            {new Date(injury.date).toLocaleDateString()}
                          </div>
                          <div className="mt-1">{injury.description}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Documents Section */}
        {activeSection === "documents" && (
          <>
            <h3 className="text-xl font-semibold text-[var(--accent)] border-b border-gray-700 pb-2">
              Documents & Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs">ID Proof</label>
                {edit ? (
                  <input
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                    value={form.idProof}
                    onChange={(e) => handleChange("idProof", e.target.value)}
                    placeholder="Enter ID proof document URL or details"
                  />
                ) : (
                  <div className="truncate">
                    {form.idProof || "Not provided"}
                  </div>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs">License Number</label>
                {edit ? (
                  <input
                    className="bg-[var(--card)] px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                    value={form.licenseNumber}
                    onChange={(e) =>
                      handleChange("licenseNumber", e.target.value)
                    }
                  />
                ) : (
                  <div>{form.licenseNumber || "Not provided"}</div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-400 text-xs">
                  Verification Status
                </label>
                <span
                  className={`px-2 py-1 rounded-full text-xs border ${
                    form.verified
                      ? "bg-green-600 border-green-500"
                      : "bg-yellow-600 border-yellow-500"
                  }`}
                >
                  {form.verified ? "Verified" : "Pending Verification"}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Emergency Contacts Section */}
        {activeSection === "emergency" && (
          <>
            <h3 className="text-xl font-semibold text-[var(--accent)] border-b border-gray-700 pb-2">
              Emergency Contacts
            </h3>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-400 text-xs">Emergency Contacts</div>
              {edit && (
                <button
                  onClick={() => addArrayItem("emergencyContacts")}
                  className="text-xs bg-[var(--accent)] text-black px-2 py-1 rounded"
                >
                  + Add Contact
                </button>
              )}
            </div>
            {form.emergencyContacts.length === 0 ? (
              <div className="text-gray-500 italic">
                No emergency contacts added
              </div>
            ) : (
              <div className="space-y-3">
                {form.emergencyContacts.map((contact, index) => (
                  <div key={index} className="bg-[var(--card)] p-3 rounded-lg">
                    {edit ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-gray-400 text-xs">Name</label>
                          <input
                            className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                            value={contact.name}
                            onChange={(e) =>
                              handleArrayChange(
                                "emergencyContacts",
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 text-xs">Phone</label>
                          <input
                            className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                            value={contact.phone}
                            onChange={(e) =>
                              handleArrayChange(
                                "emergencyContacts",
                                index,
                                "phone",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-gray-400 text-xs">
                            Relation
                          </label>
                          <input
                            className="bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 text-white w-full"
                            value={contact.relation}
                            onChange={(e) =>
                              handleArrayChange(
                                "emergencyContacts",
                                index,
                                "relation",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                          <button
                            onClick={() =>
                              removeArrayItem("emergencyContacts", index)
                            }
                            className="text-red-500 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <div className="text-gray-400 text-xs">Name</div>
                          <div className="font-medium">{contact.name}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs">Phone</div>
                          <div>{contact.phone}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs">Relation</div>
                          <div>{contact.relation}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-end mt-4 pt-4 border-t border-gray-700">
          {edit ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-[var(--card)] rounded-xl border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[var(--accent)] text-black rounded-xl shadow-md"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="px-4 py-2 bg-[var(--accent)] text-black rounded-xl shadow-md"
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
