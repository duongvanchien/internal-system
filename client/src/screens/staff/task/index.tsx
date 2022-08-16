import { Container, Grid, AvatarGroup, Avatar, Tooltip, Skeleton, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { apiLoadTasksByUser } from "../../../api/services";
import { useAppSelector } from "../../../redux/hook";
import { authState } from "../../../redux/slices/authSlice";
import "./styles.scss";
import moment from 'moment';
import { FCLoadingSkeleton } from "../../../components/FCLoadingSkeleton";

export const TaskScreen = () => {
    const [tasks, setTasks] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const authReducer = useAppSelector(authState);

    useEffect(() => {
        if (authReducer.userInfo?.clickupId) {
            const handleLoadTasksByUser = async () => {
                setIsLoading(true);
                try {
                    const res = await apiLoadTasksByUser({
                        statuses: ["to do", "in progress", "review", "complete"],
                        clickupId: authReducer.userInfo?.clickupId
                    });
                    setTasks(res.data.tasks);
                    setIsLoading(false);
                } catch (err) {
                    console.log(err)
                }

            }
            handleLoadTasksByUser()
        }
    }, [])

    const renderHeader = () => {
        return (
            <>
                <h2 style={{ color: '#fff', textAlign: 'center' }}>CÔNG VIỆC</h2>
                <div>
                    <div className="slogan_header">DANH SÁCH CÁC TASK CẦN LÀM</div>
                </div>
            </>
        )
    }

    const renderTasksWithStatus = (tasks: any[], status: string) => {
        const startDateInWeek = moment().startOf('isoWeek').valueOf()
        const endDateInWeek = moment().endOf('isoWeek').valueOf()
        return (
            <div>
                <div className="tasks_header">
                    <h5 className={"task_status " + status.toLowerCase()}>{status}</h5>
                    <small style={{ color: '#adb3bd', marginLeft: '0.5rem', textTransform: 'uppercase' }}>{tasks.length} task</small>
                </div>
                <>
                    {tasks?.map((task: any, key) => (
                        <div className="task_clickup" onClick={() => window.open(task.url, '_blank')} key={key}>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 4 }}>
                                <div className={"dot_task " + status + "_dot"} style={{ flex: 1 }}></div>
                                <div style={{ flex: 65 }}>{task?.name}</div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <AvatarGroup total={task.assignees?.length} max={3} className="assign_group">
                                    {!!task.assignees && task.assignees.map((user: any, k: any) => (
                                        <Tooltip title={user.username} key={k}>
                                            {
                                                user.profilePicture ? <Avatar alt={user.initials} src={user.profilePicture}/> : <Avatar style={{
                                                    backgroundColor: user.color,
                                                }}>{user.initials}</Avatar>
                                            }
                                        </Tooltip>
                                    ))}
                                </AvatarGroup>
                            </div>

                            <div style={{ flex: 1, textAlign: 'center' }}>
                                {
                                    (status === "todo" || status === "inprogress") && task.due_date > startDateInWeek && task.due_date < endDateInWeek ?
                                        <small style={{ color: 'red' }}>{task.due_date && moment(Number(task.due_date)).format("HH:mm DD/MM/YYYY")}</small> :
                                        <small>{task.due_date && moment(Number(task.due_date)).format("HH:mm DD/MM/YYYY")}</small>

                                }
                            </div>

                        </div>
                    ))}
                </>
            </div>
        )
    }

    const renderTasks = () => {
        if (isLoading) {
            return (
                <FCLoadingSkeleton type="line" />
            )
        } else {
            if (tasks) {
                const todoTasks = tasks?.filter((task: any) => task.status.status === "to do");
                const inprogressTasks = tasks?.filter((task: any) => task.status.status === "in progress");
                const reviewTasks = tasks?.filter((task: any) => task.status.status === "review");
                const completeTasks = tasks?.filter((task: any) => task.status.status === "complete");
                return (
                    <div>
                        {renderTasksWithStatus(inprogressTasks, "inprogress")}
                        {renderTasksWithStatus(todoTasks, "todo")}
                        {renderTasksWithStatus(reviewTasks, "review")}
                        {renderTasksWithStatus(completeTasks, "complete")}
                    </div>
                )
            }
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div className="header_page">
                    {renderHeader()}
                </div>
            </div>

            <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'center' }}>
                <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '-5rem' }}>
                    <Grid xs={12} className="profile_container">
                        {renderTasks()}
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}