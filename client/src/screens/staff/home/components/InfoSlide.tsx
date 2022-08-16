import { Paper } from '@mui/material';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation"

import SwiperCore, { Navigation } from "swiper";

SwiperCore.use([Navigation]);

export const InfoSlide = () => {
    return (
        <Swiper
            breakpoints={{
                "0": {
                    slidesPerView: 1,
                    spaceBetween: 10
                },
                "768": {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                "1024": {
                    slidesPerView: 3,
                    spaceBetween: 40
                }
            }}
            pagination={{
                clickable: true
            }}
            navigation={true}
            loop={true}
            className="info_slide"
        >
            <SwiperSlide>
                <Paper elevation={3} className="slide_element">
                    <img src="https://i.pinimg.com/originals/85/b7/4f/85b74f68d244ebc0faca8053f35f76fd.jpg" />
                    <div className="slide_element_text">Trang trí tổ chức cùng nhân viên chào đón chúc mừng ngày lễ giáng sinh.</div>
                </Paper>
            </SwiperSlide>

            <SwiperSlide>
                <Paper elevation={3} className="slide_element">
                    <img src="https://i.pinimg.com/originals/85/b7/4f/85b74f68d244ebc0faca8053f35f76fd.jpg" />
                    <div className="slide_element_text">Trang trí tổ chức cùng nhân viên chào đón chúc mừng ngày lễ giáng sinh.</div>
                </Paper>
            </SwiperSlide>

            <SwiperSlide >
                <Paper elevation={3} className="slide_element">
                    <img src="https://i.pinimg.com/originals/85/b7/4f/85b74f68d244ebc0faca8053f35f76fd.jpg" />
                    <div className="slide_element_text">Trang trí tổ chức cùng nhân viên chào đón chúc mừng ngày lễ giáng sinh.</div>
                </Paper>
            </SwiperSlide>
        </Swiper>
    )
}