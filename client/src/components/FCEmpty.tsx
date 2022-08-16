import EmptyIcon from "../assets/images/empty.png"

export const FCEmpty = () => {
    return (
        <div style={{ textAlign: "center", width: "100%" }}>
            <img src={EmptyIcon} />
            <div>Không có dữ liệu</div>
        </div>
    )
}