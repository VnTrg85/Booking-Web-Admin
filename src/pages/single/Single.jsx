import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import axios from "axios";

const Single = ({ inputs }) => {
	const location = useLocation();
	const [edit, setEdit] = useState(false);
	const path = location.pathname.split("/")[1];
	const id = location.pathname.split("/")[2];
	const { data, loading, error } = useFetch(`/${path}${path === "hotels" ? "/find" : ""}/${id}`);
	const [dataUpdate, setDataUpdate] = useState({});
	const handleClick = async e => {
		if (edit) {
			try {
				axios.put(`/${path}/${data._id}`, { ...dataUpdate });
			} catch (error) {}
		}
		setEdit(!edit);
	};
	const handleChange = e => {
		setDataUpdate(prev => ({ ...prev, [e.target.id]: e.target.value }));
	};
	console.log(dataUpdate);
	return (
		<div className="single">
			<Sidebar />
			<div className="singleContainer">
				<Navbar />
				{loading ? (
					"Loading..."
				) : (
					<div className="top">
						<div className="left">
							<div className="editButton" onClick={handleClick}>
								{edit ? "Save" : "Edit"}
							</div>
							<div className="leftWrapper">
								<h1 className="title">Information</h1>
								<div className="item">
									<img
										src={
											data.img ||
											data.photos ||
											"https://t4.ftcdn.net/jpg/04/55/10/71/360_F_455107170_36Is8hwPMPdg9fN78WaFiSwY57dkXBu3.jpg"
										}
										alt=""
										className="itemImg"
									/>
									<div className="details">
										{inputs.map((item, index) => {
											return (
												<div key={index} className="detailItem">
													<span className="itemKey">{item}:</span>
													<input
														id={item}
														className="itemValue"
														placeholder={data[item]}
														disabled={!edit}
														onChange={e => handleChange(e)}
													></input>
												</div>
											);
										})}
										{path !== "rooms" && (
											<div className="detailItem">
												<span className="itemKey">{path === "users" ? "is admin:" : "featured"}</span>
												<select
													id={path === "users" ? "isAdmin" : "featured"}
													onChange={e => handleChange(e)}
													className="itemValue"
													style={{ width: 80, textAlign: "center" }}
													disabled={!edit}
												>
													{path === "users" && (
														<>
															<option value={data.isAdmin ? "true" : "false"}>{data.isAdmin ? "Yes" : "No"}</option>
															<option value={data.isAdmin ? "false" : "true"}>{data.isAdmin ? "No" : "Yes"}</option>
														</>
													)}
													{path === "hotels" && (
														<>
															<option value={data.featured ? "true" : "false"}>{data.featured ? "Yes" : "No"}</option>
															<option value={data.featured ? "false" : "true"}>{data.featured ? "No" : "Yes"}</option>
														</>
													)}
												</select>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Single;
