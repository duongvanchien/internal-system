import { Link, TableCell, TableRow, Tooltip } from "@mui/material"
import { useEffect, useState } from "react"
import { apiLoadSpace, apiLoadTask } from "../../../api/clickup"
import FCTable from "../../../components/FCTable"
import Avatar from "@mui/material/Avatar"
import AvatarGroup from "@mui/material/AvatarGroup"
import { styled } from "@mui/material/styles"
import { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import moment from 'moment';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import "./style.scss"
import _ from "lodash"
import { FCLoadingSkeleton } from "../../../components/FCLoadingSkeleton"

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "#fcba03",
		color: "white",
		boxShadow: theme.shadows[1],
		fontSize: 11
	}
}))

export const WorksManagerment = () => {
	const [spaces, setSpaces] = useState<any>([])
	const [tasks, setTasks] = useState<any>([])
	const [loading, setloading] = useState(false)
	const [isActive, setIsActive] = useState<any>();
	
	useEffect(() => {
		apiLoadSpace({}).then(res => {
			setSpaces(res.data.spaces)
			if (res.data.spaces) {
				loadTaskInSpace({ statuses: ["to do", "in progress", "complete", "review"], spaceId: res.data.spaces[0].id })
			}
		})
	}, [])

	const loadTaskInSpace = (props: { statuses: string[]; spaceId: string }) => {
		setloading(true)
		const { statuses, spaceId } = props
		apiLoadTask({ statuses, spaceId }).then(res => {
			setloading(false)
			setIsActive(spaceId);
			setTasks(res.data.tasks)
		})
	}

	const TagName = (props: { name: string }) => {
		const { name = "" } = props
		let backgroundColors = ["#4B8FFA", "#A2C400", "#1AAFA6", "#3333CC"]
		return (
			<div
				style={{
					backgroundColor:
						backgroundColors[
						Math.floor(Math.random() * backgroundColors.length)
						]
				}}
				className="tag_container"
			>
				{name}
			</div>
		)
	}

	const renderTasks = (tasks: any, type?: string) => {
		return (
			<>
				{
					!loading ?
						<div className={type !== "all" ? "list-due_date" : ""}>
							{tasks.length > 0 && type !== "all" && <div className="title">Các task trong tuần </div>}
							<div>
								{
									tasks.map((task: any, key: any) => (
										<TableRow
											sx={{
												"&:last-child td, &:last-child th": { border: 0 }
											}}
											key={key}
										>

											<TableCell className="name-task" align="left">{task?.name}</TableCell>
											<TableCell
												align="left"
												style={{ textTransform: "uppercase" }}
											>
												{task?.status.status === "review"
													? <div className="tag-status textReview">{task?.status.status}</div>
													: task?.status.status === "to do"
														? <div className="tag-status textTodo">{task?.status.status}</div>
														: task?.status.status === "in progress"
															? <div className="tag-status textProgress">{task?.status.status}</div>
															: task?.status.status === "complete"
																? <div className="tag-status textComplete">{task?.status.status}</div>
																: <div style={{ color: 'black' }} className="tag-status">{task?.status.status}</div>}
											</TableCell>
											<TableCell align="left">
												<div>
													<AvatarGroup max={3} className="item-assign">
														{task?.assignees.map((itemAss: any) => (
															<LightTooltip title={itemAss?.username}>
																{itemAss?.profilePicture ? (
																	<Avatar
																		className="item-assign"
																		alt="Avatar"
																		src={
																			itemAss?.profilePicture
																		}
																		style={{
																			fontSize: "10px",
																			fontWeight: 500,
																			width: "100%",
																			height: "100%"
																		}}
																	/>
																) : (
																	<Avatar
																		style={{
																			fontSize: "10px",
																			fontWeight: 500,
																			width: "100%",
																			height: "100%"
																		}}
																		className="item item-assign"
																	>
																		{" "}
																		<TagName
																			name={
																				itemAss?.initials
																			}
																		/>
																	</Avatar>
																)}
															</LightTooltip>
														))}
													</AvatarGroup>
												</div>
											</TableCell>
											<TableCell align="left">{task?.due_date ? moment(+task?.due_date).format("hh:mm DD/MM/YYYY") : "Chưa cập nhật"}</TableCell>
											<TableCell align="left"><Link target="_blank" className="link-task" href={task?.url}>Go to Task <ArrowCircleRightIcon /></Link></TableCell>
										</TableRow>
									))
								}
							</div>
						</div> :
						<FCLoadingSkeleton type="line" />
				}

			</>
		)
	}

	const renderBodyTable = () => {
		const startDate = moment().startOf('isoWeek').valueOf()
		const endDate = moment().endOf('isoWeek').valueOf()
		const warningTasks = tasks.filter((item: any) => item.due_date != null && startDate < item.due_date && item.due_date < endDate)
		const allTasks = tasks.filter((item: any) => _.findIndex(warningTasks, (o: any) => o.id === item.id) === -1)
		return (
			<>
				{renderTasks(warningTasks)}
				{renderTasks(allTasks, "all")}
			</>
		)
	}

	return (
		<div style={{ display: "flex" }}>
			<div className="space-item">
				{spaces.length > 0 &&
					spaces.map((space: any, key: any) => (
						<div key={key}
							className={`${isActive === space.id ? 'active-space' : ''}`}
							onClick={() =>
								loadTaskInSpace({
									statuses: ["to do", "in progress", "complete", "review"],
									spaceId: space.id
								})
							}
						>
							<span >{space?.name}</span>
						</div>
					))}
			</div>
			<div className="table-show-task" style={{ width: "80%", marginLeft: 'auto' }}>
				<FCTable
					headers={[
						"List Task",
						"Trạng thái",
						"Assignee",
						"Due Date",
						"Go to Task"
					]}
					tableBody={renderBodyTable()}
				/>
			</div>
		</div>
	)
}
