import { Pagination } from "@mui/material"

export const FCPagination = (props: {
    totalPage: number,
    handleAction?: any
}) => {
    const { totalPage, handleAction } = props;

    const handlePageChange = (e: any, value: number) => {
        handleAction(value)
    }

    return (
        <div style={{ marginTop: '0.5rem', float: 'right' }}>
            <Pagination count={totalPage} color="primary" variant="outlined" onChange={handlePageChange} />
        </div>
    )
}