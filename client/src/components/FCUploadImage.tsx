import { CircularProgress } from "@mui/material";
import { useState } from "react";

export const FCUploadImage = (props: {
    onChange?: any;
    className?: string;
    url?: string;
    id?: string
}) => {
    const { onChange, className, url, id } = props;
    const [loading, setLoading] = useState(false)

    const handleChangeImg = async (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (!input.files?.length) {
            return
        }
        setLoading(true);
        await onChange(e);
        setLoading(false);
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <label htmlFor={id || "upload_img"} className={className}>
                {!loading ?
                    <>
                        {
                            url ?
                                <img src={url} alt="image" className={className} style={{ objectFit: "cover" }}></img>
                                : "Chọn ảnh"
                        }
                    </> : <div><CircularProgress style={{ width: '20px', height: 'auto' }} /></div>
                }
            </label>
            <input type="file" id={id || "upload_img"} style={{ display: "none" }} onChange={(e: any) => handleChangeImg(e)}></input>
        </div>
    )
}