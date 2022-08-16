import _ from 'lodash';
import { Event } from '../../../../../models/event'

//ACTIONS
export enum ActionTypes {
    SET_LOADING_UPLOAD_IMAGES,
    SET_LOADING_UPLOAD_VIDEOS,
    OPEN_ADD_OR_UPDATE_EVENT,
    OPEN_DELETE_EVENT,
    SET_START_TIME,
    SET_END_TIME,
    SET_TYPE_UPLOAD_IMAGES,
    SET_TYPE_UPLOAD_VIDEO,
    SET_THUMB_IMAGE,
    SET_BACKGROUND_IMAGE,
    SET_IMAGES_URL,
    SET_VIDEOS_URL,
    SET_EVENT_INFO,
    DELETE_IMAGE,
    DELETE_VIDEO,
    RESET,
    SET_DEFAULT_CONTENT_EDITOR,
    SET_CONTENT_EDITOR
}

interface EventAction {
    type: ActionTypes,
    loadingImages?: boolean,
    loadingVideos?: boolean,
    openDialogAddOrUpdateEvent?: boolean,
    openDialogDeleteEvent?: boolean,
    startTime?: Date | null,
    endTime?: Date | null,
    typeUploadImages?: number,
    typeUploadVideo?: number,
    thumbImage?: string,
    backgroundImage?: string,
    imagesUrl?: string[],
    videosUrl?: string[],
    eventInfo?: Event | null,
    image?: string,
    video?: string,
    defaultContentEditor?: string,
    contentEditor?: string
}

type EventState = {
    loadingImages: boolean,
    loadingVideos: boolean,
    openDialogAddOrUpdateEvent: boolean,
    openDialogDeleteEvent: boolean,
    startTime: Date | null,
    endTime: Date | null,
    typeUploadImages: number,
    typeUploadVideo: number,
    thumbImage: string,
    backgroundImage: string,
    imagesUrl: string[],
    videosUrl: string[],
    eventInfo: Event | null,
    image: string,
    video: string,
    defaultContentEditor: string,
    contentEditor: string
}

export const initState: EventState = {
    loadingImages: false,
    loadingVideos: false,
    openDialogAddOrUpdateEvent: false,
    openDialogDeleteEvent: false,
    startTime: new Date(),
    endTime: new Date(),
    typeUploadImages: 0,
    typeUploadVideo: 0,
    thumbImage: "",
    backgroundImage: "",
    imagesUrl: [],
    videosUrl: [],
    eventInfo: null,
    image: "",
    video: "",
    defaultContentEditor: "",
    contentEditor: ""
}

const initialState = { ...initState };

export const eventReducer = (state: EventState = initState, action: EventAction): EventState => {
    switch (action.type) {
        case ActionTypes.OPEN_ADD_OR_UPDATE_EVENT:
            state.openDialogAddOrUpdateEvent = action.openDialogAddOrUpdateEvent!;
            return { ...state }
        case ActionTypes.SET_START_TIME:
            state.startTime = action.startTime!;
            return { ...state }
        case ActionTypes.SET_END_TIME:
            state.endTime = action.endTime!;
            return { ...state }
        case ActionTypes.SET_TYPE_UPLOAD_IMAGES:
            state.typeUploadImages = action.typeUploadImages!;
            return { ...state }
        case ActionTypes.SET_TYPE_UPLOAD_VIDEO:
            state.typeUploadVideo = action.typeUploadVideo!;
            return { ...state }
        case ActionTypes.SET_THUMB_IMAGE:
            state.thumbImage = action.thumbImage!;
            return { ...state }
        case ActionTypes.SET_BACKGROUND_IMAGE:
            state.backgroundImage = action.backgroundImage!;
            return { ...state }
        case ActionTypes.SET_IMAGES_URL:
            state.imagesUrl = _.uniq(state.imagesUrl.concat(action.imagesUrl!));
            return { ...state }
        case ActionTypes.SET_LOADING_UPLOAD_IMAGES:
            state.loadingImages = action.loadingImages!;
            return { ...state }
        case ActionTypes.SET_LOADING_UPLOAD_VIDEOS:
            state.loadingVideos = action.loadingVideos!;
            return { ...state }
        case ActionTypes.SET_VIDEOS_URL:
            state.videosUrl = _.uniq(state.videosUrl.concat(action.videosUrl!));
            return { ...state }
        case ActionTypes.SET_EVENT_INFO:
            state.eventInfo = action.eventInfo!
            return { ...state }
        case ActionTypes.OPEN_DELETE_EVENT:
            state.openDialogDeleteEvent = action.openDialogDeleteEvent!
            return { ...state }
        case ActionTypes.DELETE_IMAGE:
            let imagesCopy = [...state.imagesUrl];
            _.remove(imagesCopy, (url) => url == action.image);
            state.imagesUrl = imagesCopy;
            return { ...state }
        case ActionTypes.DELETE_VIDEO:
            let videosCopy = [...state.videosUrl];
            _.remove(videosCopy, (url) => url == action.video);
            state.videosUrl = videosCopy;
            return { ...state }
        case ActionTypes.SET_CONTENT_EDITOR:
            state.contentEditor = action.contentEditor!;
            return { ...state }
        case ActionTypes.SET_DEFAULT_CONTENT_EDITOR:
            state.defaultContentEditor = action.defaultContentEditor!;
            return { ...state }
        case ActionTypes.RESET:
            state = initialState;
            return { ...state }
        default:
            throw new Error('Unknown Action');
    }
}

export const setOpenDialogAddOrUpdateEvent = (openDialogAddOrUpdateEvent: boolean): EventAction => {
    return {
        type: ActionTypes.OPEN_ADD_OR_UPDATE_EVENT,
        openDialogAddOrUpdateEvent
    }
}

export const setStartTime = (startTime: Date | null): EventAction => {
    return {
        type: ActionTypes.SET_START_TIME,
        startTime
    }
}

export const setEndTime = (endTime: Date | null): EventAction => {
    return {
        type: ActionTypes.SET_END_TIME,
        endTime
    }
}

export const setTypeUploadImages = (typeUploadImages: number): EventAction => {
    return {
        type: ActionTypes.SET_TYPE_UPLOAD_IMAGES,
        typeUploadImages
    }
}

export const setTypeUploadVideo = (typeUploadVideo: number): EventAction => {
    return {
        type: ActionTypes.SET_TYPE_UPLOAD_VIDEO,
        typeUploadVideo
    }
}

export const setThumbImage = (thumbImage: string): EventAction => {
    return {
        type: ActionTypes.SET_THUMB_IMAGE,
        thumbImage
    }
}

export const setBackgroundImage = (backgroundImage: string): EventAction => {
    return {
        type: ActionTypes.SET_BACKGROUND_IMAGE,
        backgroundImage
    }
}

export const setImagesUrl = (imagesUrl: string[]): EventAction => {
    return {
        type: ActionTypes.SET_IMAGES_URL,
        imagesUrl
    }
}

export const setVideosUrl = (videosUrl: string[]): EventAction => {
    return {
        type: ActionTypes.SET_VIDEOS_URL,
        videosUrl
    }
}

export const setLoadingImages = (loadingImages: boolean): EventAction => {
    return {
        type: ActionTypes.SET_LOADING_UPLOAD_IMAGES,
        loadingImages
    }
}

export const setLoadingVideos = (loadingVideos: boolean): EventAction => {
    return {
        type: ActionTypes.SET_LOADING_UPLOAD_VIDEOS,
        loadingVideos
    }
}

export const setEventInfo = (eventInfo: Event | null): EventAction => {
    return {
        type: ActionTypes.SET_EVENT_INFO,
        eventInfo
    }
}

export const setOpenDialogDeleteEvent = (openDialogDeleteEvent: boolean): EventAction => {
    return {
        type: ActionTypes.OPEN_DELETE_EVENT,
        openDialogDeleteEvent
    }
}

export const setDeleteImage = (image: string): EventAction => {
    return {
        type: ActionTypes.DELETE_IMAGE,
        image
    }
}

export const setDeleteVideo = (video: string): EventAction => {
    return {
        type: ActionTypes.DELETE_VIDEO,
        video
    }
}

export const resetInitialState = (): EventAction => {
    return {
        type: ActionTypes.RESET
    }
}

export const setDefaultContentEditor = (defaultContentEditor: string): EventAction => {
    return {
        type: ActionTypes.SET_DEFAULT_CONTENT_EDITOR,
        defaultContentEditor
    }
}

export const setContentEditor = (contentEditor: string): EventAction => {
    return {
        type: ActionTypes.SET_CONTENT_EDITOR,
        contentEditor
    }
}








