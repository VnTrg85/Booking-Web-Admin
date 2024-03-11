import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewRoom = () => {
	const [info, setInfo] = useState({});
	const [hotelId, setHotelId] = useState(undefined);
	const [rooms, setRooms] = useState([]);

	const { data, loading, error } = useFetch("/hotels/");
	const handleChange = e => {
		setInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
	};
	const handleSelect = e => {
		setHotelId(e.target.value);
	};

	const handleClick = async e => {
		e.preventDefault();
		const roomNumbers = rooms.split(",").map(room => ({
			number: room,
		}));
		try {
			const newRoom = { ...info, roomNumbers };
			await axios.post(`/rooms/${hotelId}`, newRoom);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="newRoom">
			<Sidebar />
			<div className="newContainer">
				<Navbar />
				<div className="top">
					<h1>Add new room</h1>
				</div>
				<div className="bottom">
					<div className="right">
						<form>
							{roomInputs.map(input => (
								<div className="formInput" key={input.id}>
									<label>{input.label}</label>
									<input id={input.id} type={input.type} placeholder={input.placeholder} onChange={e => handleChange(e)} />
								</div>
							))}
							<div className="formInput">
								<label>Room number</label>
								<textarea onChange={e => setRooms(e.target.value)} placeholder="Give comma between room number"></textarea>
							</div>
							<div className="formInput">
								<label>Choose a hotel</label>
								<select
									onChange={e => {
										handleSelect(e);
									}}
									id="hotelId"
								>
									{loading
										? "Loading..."
										: data.map(hotel => {
												return (
													<option key={hotel._id} value={hotel._id}>
														{hotel.name}
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

export default NewRoom;
