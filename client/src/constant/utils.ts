import KSInternalConfig from "../../../common/config"

export const TYPE_ERROR = {
    isEmpty: "Vui lòng điền đầy đủ thông tin",
    rePasswordError: "Mật khẩu không khớp",
    emailError: "Email không đúng định dạng",
    phoneNumberError: "Số điện thoại không đúng định dạng"
}

export const USER_TYPE = [
    {
        value: 0,
        label: "Fulltime"
    },
    {
        value: 1,
        label: "Parttime"
    },
    {
        value: 2,
        label: "Thử việc Fulltime"
    },
    {
        value: 3,
        label: "Thử việc Parttime"
    },
    {
        value: 4,
        label: "Thực tập sinh"
    }
]

export const GENDER = [
    {
        value: 0,
        label: "Nam"
    },
    {
        value: 1,
        label: "Nữ"
    },
]

export const MONTHS = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
]

export const YEARS = [
    { value: 2015, label: "Năm 2015" },
    { value: 2016, label: "Năm 2016" },
    { value: 2017, label: "Năm 2017" },
    { value: 2018, label: "Năm 2018" },
    { value: 2019, label: "Năm 2019" },
    { value: 2020, label: "Năm 2020" },
    { value: 2021, label: "Năm 2021" },
    { value: 2022, label: "Năm 2022" },
    { value: 2023, label: "Năm 2023" },
    { value: 2024, label: "Năm 2024" },
    { value: 2025, label: "Năm 2025" },
    { value: 2026, label: "Năm 2026" },
]

export const TIME_KEEPING_STATUS = [
    { value: -1, label: "Đi muộn", color: '#FEC001' },
    { value: 0, label: "Chưa cập nhật trạng thái", color: 'gray' },
    { value: 1, label: "Đạt yêu cầu", color: '#3FB660' },
    { value: 2, label: "Quên chấm công", color: 'red' },
    { value: 3, label: "Nghỉ", color: '#FF5151' },
    { value: 4, label: "Không đủ thời gian", color: '#51CBFF' },
    { value: 5, label: "Không đạt yêu cầu", color: '#607d8b' }
]

export const FORM_TYPES = [
    { value: 0, label: "Đơn xin nghỉ" },
    { value: 1, label: "Đơn xin đi muộn" }
]

export const FORM_STATUS = [
    { label: "Chờ phê duyệt", value: KSInternalConfig.STATUS_WAITING, color: "#FDB514" },
    { label: "Đã phê duyệt", value: KSInternalConfig.STATUS_APPROVED, color: '#20A967' },
    { label: "Từ chối", value: KSInternalConfig.STATUS_REJECTED, color: '#FF455B' },
]