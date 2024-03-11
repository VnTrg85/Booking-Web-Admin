import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import KingBedOutlinedIcon from "@mui/icons-material/KingBedOutlined";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
const Widget = ({ type }) => {
	let list;

	//temporary
	const diff = 20;
	const { data, loading, reFetch } = useFetch(`/${type}s`);

	const navigate = useNavigate();
	const handleClick = e => {
		navigate(e.target.id);
	};
	switch (type) {
		case "user":
			list = {
				title: "USERS",
				path: "users",
				link: "See all users",
				icon: (
					<PersonOutlinedIcon
						className="icon"
						style={{
							color: "crimson",
							backgroundColor: "rgba(255, 0, 0, 0.2)",
						}}
					/>
				),
			};
			break;
		case "hotel":
			list = {
				title: "HOTELS",
				path: "hotels",
				link: "See all hotels",
				icon: (
					<HotelOutlinedIcon
						className="icon"
						style={{
							backgroundColor: "rgba(218, 165, 32, 0.2)",
							color: "goldenrod",
						}}
					/>
				),
			};
			break;
		case "room":
			list = {
				title: "ROOMS",
				path: "rooms",
				link: "View all rooms",
				icon: <KingBedOutlinedIcon className="icon" style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }} />,
			};
			break;
		default:
			break;
	}

	return (
		<div className="widget">
			<div className="left">
				<span className="title">{list.title}</span>
				<span className="counter">{data.length}</span>
				<span className="link" id={list.path} onClick={e => handleClick(e)}>
					{list.link}
				</span>
			</div>
			<div className="right">
				<div className="percentage positive">
					<KeyboardArrowUpIcon />
					{diff} %
				</div>
				{list.icon}
			</div>
		</div>
	);
};

export default Widget;
