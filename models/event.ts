class Event {
    _id: string | undefined;
    userId: string | undefined;
    departmentId: string | undefined;
    /**
     * Thành viên tham gia sự kiện
     */
    memberIds: string[];

    title: string;
    startTime: number;
    endTime: number;
    imagesUrl: string[];
    videosUrl: string[];
    extendUrl: string[];
    description: string;
    shortDescription: string;
    address: string;
    type: number;
    status: number;
    background: string;
    thumbnail: string;
    constructor(props: any) {
        if (!props) {
            props = {};
        }
        this._id = props._id ?? undefined;
        this.title = props.title ?? '';
        this.address = props.address ?? '';
        this.description = props.description ?? '';
        this.shortDescription = props.shortDescription ?? '';
        this.startTime = props.startTime ?? 0;
        this.endTime = props.endTime ?? 0;
        this.type = props.type ?? 0;
        this.status = props.status ?? 0;
        this.memberIds = props.memberIds ?? [];
        this.imagesUrl = props.imagesUrl ?? [];
        this.videosUrl = props.videosUrl ?? [];
        this.extendUrl = props.extendUrl ?? [];
        this.userId = props.userId?._id ?? (props.userId ?? undefined);
        this.departmentId = props.departmentId?._id ?? (props.departmentId ?? undefined);
        this.background = props.background ?? '';
        this.thumbnail = props.thumbnail ?? '';
    }
}

export { Event }