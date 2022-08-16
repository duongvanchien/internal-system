import { Editor } from "@tinymce/tinymce-react"
import { apiUploadFile } from "../api/services";


export const FCEditor = (props: {
    height?: number,
    defaultValue?: string,
    handleChangeContent?: any,
}) => {
    const { height, defaultValue, handleChangeContent } = props;

    const images_upload_handler_editor = async (blob: any, success: any, error: any) => {
        try {
            const formData = new FormData();
            formData.append("file", blob.blob())
            const res = await apiUploadFile(formData);
            success(res.data);
        } catch (err) {
            success("Upload thất bại, vui lòng thử lại");
        }
    }

    const handleInit = (evt: any, editor: any) => {
        handleChangeContent(editor.getContent());
    }

    return (
        <>
            <Editor
                /**
                 * env
                 */
                apiKey={process.env.REACT_APP_TINY_KEY}
                onChange={handleInit}
                initialValue={defaultValue}
                init={{
                    mobile: {
                        plugins: 'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable'
                    },
                    height: height || 500,
                    menubar: 'file edit view insert format tools table tc',
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor tinydrive ',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

                    content_css: 'dark',
                    autosave_ask_before_unload: true,
                    contextmenu: 'link image imagetools table configurepermanentpen',
                    images_upload_handler: images_upload_handler_editor,
                }}
            />
        </>
    )
}