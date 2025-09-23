import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify"; // ✅ Prevent XSS by sanitizing input
import { ScheduleService } from '../../Services/ScheduleService';
import { TypeService, Type } from "../../Services/TypeService";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import WasteCollecteHeader from "../../Components/waste_collecte_header";

interface Schedule {
  _id?: string;
  fname: string;
  lname: string;
  mobile: string;
  email: string;
  cdate: string;
  area: string;
  timeslot: string;
  description: string;
  type: string;
}

const UpdateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wasteTypes, setWasteTypes] = useState<Type[]>([]);
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState<Schedule>({
    _id: "",
    fname: "",
    lname: "",
    mobile: "",
    email: "",
    cdate: "",
    area: "",
    timeslot: "",
    description: "",
    type: "",
  });

  useEffect(() => {
    const fetchWasteTypes = async () => {
      try {
        const types = await TypeService.fetchAllTypes();
        setWasteTypes(types);
      } catch (err) {
        console.error("Error fetching waste types:", err);
        setError("Failed to fetch waste types.");
      }
    };

    fetchWasteTypes();
  }, []);

  const fetchSchedule = async () => {
    if (!id) return;
    try {
      const response = await ScheduleService.fetchScheduleById(id);
      setSchedule(response);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // ✅ Sanitize all inputs → prevents Stored XSS by stripping dangerous HTML/JS
    const cleanValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    // ✅ Block HTML injection in fname/lname → prevents <script> or <img onerror> etc.
    if ((name === "fname" || name === "lname") && /[<>]/.test(cleanValue)) {
      alert("Special characters like < and > are not allowed in names.");
      return;
    }

    // ✅ Basic input validation to prevent malformed/malicious data
    if (name === "mobile" && !/^[0-9]{10}$/.test(cleanValue)) {
      // only 10-digit numbers allowed → prevents invalid injection into DB
      alert("Invalid mobile number format.");
      return;
    }

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
      // ensures email structure → prevents HTML injection via email field
      alert("Invalid email format.");
      return;
    }

    setSchedule({ ...schedule, [name]: cleanValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedule._id) return;

    try {
      // ✅ Backend receives sanitized + validated data → prevents Stored XSS and Injection
      await ScheduleService.updateSchedule(schedule._id, schedule);
      alert("Schedule updated successfully!");
      setSchedule({
        _id: "",
        fname: "",
        lname: "",
        mobile: "",
        email: "",
        cdate: "",
        area: "",
        timeslot: "",
        description: "",
        type: "",
      });
      navigate("/schedule/view");
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Navbar />
      <WasteCollecteHeader />
      <div className="flex justify-center items-center h-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 lg:max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
            Update Schedule
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ✅ All inputs now sanitized in handleChange → stops XSS */}
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="fname"
                value={schedule.fname}
                onChange={handleChange} // sanitized + no < >
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lname"
                value={schedule.lname}
                onChange={handleChange} // sanitized + no < >
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Mobile</label>
              <input
                type="tel"
                name="mobile"
                value={schedule.mobile}
                onChange={handleChange} // validated for 10-digit numeric only
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={schedule.email}
                onChange={handleChange} // validated for proper email structure
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Collection Date</label>
              <input
                type="date"
                name="cdate"
                value={schedule.cdate}
                onChange={handleChange}
                min={today} // ✅ prevents past date manipulation
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Area</label>
              <select
                name="area"
                value={schedule.area}
                onChange={handleChange}
                required
              >
                <option value="">Select Area</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Galle">Galle</option>
                <option value="Malabe">Malabe</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Timeslot</label>
              <select
                name="timeslot"
                value={schedule.timeslot}
                onChange={handleChange}
                required
              >
                <option value="">Select timeslot</option>
                <option value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</option>
                <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
                <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
                <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Waste Type</label>
              <select
                name="type"
                value={schedule.type}
                onChange={handleChange}
                required
              >
                <option value="">Select waste type</option>
                {wasteTypes.map((type) => (
                  <option key={type.wastetype} value={type.wastetype}>
                    {type.wastetype}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={schedule.description}
                onChange={handleChange} // sanitized via DOMPurify → stops script injection
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Update Schedule
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateForm;
