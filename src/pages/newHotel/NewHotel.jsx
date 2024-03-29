import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewHotel = () => {
	const [files, setFiles] = useState("");
	const [info, setInfo] = useState({ featured: true });
	const [rooms, setRooms] = useState([]);
	const navigate = useNavigate();
	const { data, loading, error } = useFetch("/rooms");
	const handleChange = e => {
		setInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
	};
	const handleClick = async e => {
		e.preventDefault();
		try {
			const list = await Promise.all(
				Object.values(files).map(async file => {
					const data = new FormData();
					data.append("file", file);
					data.append("upload_preset", "uploadBooking");
					const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/vantruong/image/upload", data);
					const { url } = uploadRes.data;
					return url;
				}),
			);
			const newHotel = { ...info, photos: list, rooms };
			await axios.post("/hotels/", newHotel);
			navigate(-1);
		} catch (error) {
			alert(error.response.data.message);
		}
	};
	const handleSelect = e => {
		const value = Array.from(e.target.selectedOptions, option => option.value);
		setRooms(value);
	};
	return (
		<div className="new">
			<Sidebar />
			<div className="newContainer">
				<Navbar />
				<div className="top">
					<h1>Add new hotel</h1>
				</div>
				<div className="bottom">
					<div className="left">
						<img
							src={files ? URL.createObjectURL(files[0]) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
							alt=""
						/>
					</div>
					<div className="right">
						<form>
							<div className="formInput">
								<label htmlFor="file">
									Image: <DriveFolderUploadOutlinedIcon className="icon" />
								</label>
								<input multiple type="file" id="file" onChange={e => setFiles(e.target.files)} style={{ display: "none" }} />
							</div>

							{hotelInputs.map(input => (
								<div className="formInput" key={input.id}>
									<label>{input.label}</label>
									<input id={input.id} onChange={e => handleChange(e)} type={input.type} placeholder={input.placeholder} />
								</div>
							))}
							<div className="formInput">
								<label>Featured</label>
								<select id="featured" onChange={e => handleChange(e)}>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
							</div>
							<div className="formSelect">
								<label>Rooms</label>
								<select id="rooms" multiple onChange={e => handleSelect(e)}>
									{loading
										? "Loading..."
										: data.map((room, index) => {
												return (
													<option key={index} value={room._id}>
														{room.title}
													</option>
												);
										  })}
								</select>
							</div>
							<button onClick={e => handleClick(e)}>Send</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewHotel;
