import { useCallback, useState } from 'react'
import Dropzone from "react-dropzone";
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

export const FCUploadFile = (props: {
    acceptTypes: string[],
    handleDropFile: any,
    fileSelected: File | null
}) => {
    const { acceptTypes, handleDropFile, fileSelected } = props;

    const handleDrop = useCallback((files: any) => {
        handleDropFile(files);
    }, [])

    return (
        <div>
            <Dropzone
                onDrop={handleDrop}
                accept={acceptTypes}
                maxFiles={1}
                maxSize={5000000}
            >
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <DriveFolderUploadOutlinedIcon style={{ fontSize: '4rem' }} />
                        <div>Kéo thả file hoặc click để chọn</div>
                    </div>
                )}
            </Dropzone>
            <div>
                <strong>File đã chọn:</strong>
                <ul>
                    {
                        fileSelected ?
                            <div style={{ display: 'flex', alignItems: 'center', }}>
                                <InsertDriveFileOutlinedIcon style={{ color: 'gray' }} />
                                <div>{fileSelected.name}</div>
                            </div> :
                            <i style={{ textAlign: 'center' }}>Chưa chọn file nào</i>
                    }
                </ul>
            </div>
        </div>
    );
}