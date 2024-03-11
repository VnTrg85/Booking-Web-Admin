import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const Datatable = ({ columns }) => {
	const location = useLocation();
	const path = location.pathname.split("/")[1];
	const [list, setList] = useState([]);
	const { data, loading, error } = useFetch(`/${path}`);
	const currentUser = JSON.parse(localStorage.getItem("user"));
	useEffect(() => {
		setList(data);
	}, [data]);
	const handleDelete = async id => {
		try {
			if (path === "rooms") {
				const hotels = await axios.get(`/hotels?rooms=${id}`);
				await Promise.all(
					hotels.data.map(async hotel => {
						const res = await axios.delete(`/${path}/${id}/${hotel._id}`);
						return res;
					}),
				);
			} else {
				await axios.delete(`/${path}/${id}`);
			}
			setList(list.filter(item => item._id !== id));
		} catch (error) {}
	};

	const actionColumn = [
		{
			field: "action",
			headerName: "Action",
			width: 200,
			renderCell: params => {
				return (
					<div className="cellAction">
						<Link to={`/${path}/${params.row._id}`} style={{ textDecoration: "none" }}>
							<div className="viewButton">View</div>
						</Link>
						<div
							className="deleteButton"
							onClick={
								params.row._id !== currentUser._id
									? () => handleDelete(params.row._id)
									: () => {
											alert("User can not delete yourself");
									  }
							}
						>
							Delete
						</div>
					</div>
				);
			},
		},
	];
	return (
		<div className="datatable">
			<div className="datatableTitle">
				Add New
				<Link to={`/${path}/new`} className="link">
					Add New
				</Link>
			</div>
			{loading ? (
				"Loading..."
			) : (
				<DataGrid
					className="datagrid"
					rows={list}
					columns={columns.concat(actionColumn)}
					pageSize={9}
					rowsPerPageOptions={[9]}
					checkboxSelection
					getRowId={row => row._id}
				/>
			)}
		</div>
	);
};

export default Datatable;
