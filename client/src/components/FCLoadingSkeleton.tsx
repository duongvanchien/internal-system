import { Box, Skeleton } from "@mui/material"

export const FCLoadingSkeleton = (props: {
    type: "line"
}) => {
    switch (props.type) {
        case "line":
            return (
                <Box sx={{ width: "100%" }}>
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                    <Skeleton animation="wave" style={{ height: '3rem' }} />
                </Box>
            )
    }
}