import { UserModel } from '../database/mongo/users';
import moment from 'moment';
import cron from "node-cron";
import { listContentBirthday, listImgBirthday } from './data';
import _ from 'lodash';
import { TimeKeepingModel } from '../database/mongo/time_keeping';
import KSInternalConfig from '../../../common/config';
import { compareTime, StatisticTimeSheetItf, TimeSheetImportInf } from '../services/time_keeping';
import { getApi } from '../clickup/fetchapi';
import { StatisticTimeSheetModel } from '../database/mongo/statistic_timesheet';

const fs = require("fs");
const { MessageActionRow, MessageButton } = require('discord.js');
const Discord = require("discord.js");
const helper = require('./helper');
export class DiscordConfig {
    private client = new Discord.Client();
    private commands = new Discord.Collection();


    public init = async () => {
        const users = await UserModel.find({ status: 1 });

        this.client.on('ready', async () => {
            console.log(this.client.user?.username + " is ready");

            const guild = this.client.guilds.cache.get(process.env.GUILD_ID);
            const channel: any = guild?.channels.cache.get(process.env.CHANNEL_ID);

            // load list task
            // const list_task = await getApi({ url: "https://api.clickup.com/api/v2/team/25534334/task", params: { statuses: ["complete", "review"], subtasks: true, project_ids: [85673580], } });

            // load list space
            const list_space = await getApi({ url: "https://api.clickup.com/api/v1/team/25534334/space" });

            // console.log(moment("00:00", "HH:mm").toDate().getTime());
            // console.log(moment("23:59", "HH:mm").toDate().getTime());

            // bot gửi task
            // cron.schedule(`0 30 8 * * 1-6`, async () => {
            //     users.forEach(async (user) => {
            //         if (user.clickupId) {
            //             const list_task = await getApi({
            //                 url: "https://api.clickup.com/api/v2/team/25534334/task",
            //                 params: {
            //                     assignees: [user.clickupId],
            //                     subtasks: true,
            //                     order_by: "updated",
            //                     statuses: ["in progress", "to do"],
            //                     due_date_lt: moment("23:59", "HH:mm").toDate().getTime(),
            //                     due_date_gt: moment("00:00", "HH:mm").toDate().getTime()
            //                 }
            //             });
            //             const findUser = await this.client.users.cache.find(value => value.id === user.discordId);
            //             list_task.tasks.forEach(task => {
            //                 const embeds = new Discord.MessageEmbed()
            //                     .setColor(task.status.color)
            //                     .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
            //                     .setTimestamp()
            //                     .setURL(task.url)
            //                     .setAuthor(`${task.creator?.username} assigned to me`)
            //                     .setTitle(task.name)
            //                     .setDescription(task.due_date
            //                         ? `${task?.text_content || "Không có ghi chú"} 
            //                     \n - ***Estimate: ${moment(Number(task.due_date)).format("HH:mm DD/MM/YYYY")}***`
            //                         : `${task.text_content || "Không có ghi chú"} \n - ***Estimate: chưa cập nhật***`
            //                         + `\n - ***Project: ${list_space.spaces.find(space => space.id === task.space.id).name} ***`)
            //                 findUser?.send(embeds)
            //             })

            //             list_task.tasks.length && await findUser?.send(`Bạn có ${list_task.tasks.length} tasks đến hạn trong ngày hôm nay`)
            //             // const embedTutorial = new Discord.MessageEmbed()
            //             //     .setColor("RED")
            //             //     .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
            //             //     .setTimestamp()
            //             //     .setTitle(`Hướng dẫn`)
            //             //     .setDescription(`
            //             //     \n- Xem danh sách công việc:
            //             //          + Các task todo: **!todo**
            //             //          + Các task inprogress: **!inprogress**
            //             //          + Các task review: **!review**
            //             //          + Các task complete: **!complete**
            //             //     \n- Chấm công:
            //             //         + Checkin: **!checkin**
            //             //         + Checkout: **!checkout**
            //             //             `)
            //             // await findUser?.send(embedTutorial)
            //         }
            //     });
            // }, {
            //     scheduled: true,
            //     timezone: "Asia/Ho_Chi_Minh"
            // });

            //Discord bot gửi tin nhắn sự kiện
            users.forEach(async (user, key) => {
                const day = Number(moment(user.birth).format("D"));
                const month = Number(moment(user.birth).format("M"));
                const img = await listImgBirthday[_.random(0, listImgBirthday.length)];
                const content = await listContentBirthday[_.random(0, listContentBirthday.length)];
                await cron.schedule(`${key + 2} 0 8 ${day} ${month} *`, async () => {
                    const embeds = await new Discord.MessageEmbed()
                        .setTitle(`Chúc mừng sinh nhật ${user?.name}`)
                        .setColor("RANDOM")
                        .setThumbnail(`${user?.avatar || "https://hanhtrinhmouoc2018.thanhnien.vn/img/general/none-avatar.png"}`)
                        .setImage(img || "https://nhattientuu.com/wp-content/uploads/2020/08/hinh-anh-chuc-mung-sinh-nhat-dep-5.jpg")
                        .setDescription(content)
                        .setTimestamp(new Date())
                    await channel.send(embeds);
                }, {
                    scheduled: true,
                    timezone: "Asia/Ho_Chi_Minh"
                });
            });

            // Discord bot gửi tin nhắn cho tất cả thành viên trong channel mỗi ngày
            // cron.schedule(`0 7 11 * * 1-6`, async () => {
            //     channel?.members?.forEach(member => {
            //         if (!member.user.bot) {
            //             const embeds = new Discord.MessageEmbed()
            //                 .setColor("RANDOM")
            //                 .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
            //                 .setTimestamp()
            //                 .setImage("https://source.unsplash.com/random")
            //                 .setTitle(`Hi ${member.user.username}`)
            //                 .setDescription(`
            //                     Nhập **!checkin** để xác nhận checkin, để checkout vui lòng nhập **!checkout**
            //                 `)
            //             member.send(embeds)
            //         }
            //     })
            // }, {
            //     scheduled: true,
            //     timezone: "Asia/Ho_Chi_Minh"
            // });

            // Bot ping quên checkout
            cron.schedule(`0 0 21 * * 1-6`, async () => {
                const loadTimeKeepings = await TimeKeepingModel.find({
                    date: moment(new Date()).format("D/M/YYYY"),
                }).populate("userId");

                loadTimeKeepings.forEach(async (value: any) => {
                    if (!value.checkout) {
                        const workingType = compareTime(value.checkin, "", value?.userId);
                        await TimeKeepingModel.findOneAndUpdate({
                            date: moment(new Date()).format("D/M/YYYY"),
                            userId: value.userId._id
                        }, {
                            checkout: "",
                            type: workingType.type,
                            workingNumber: workingType.workingNumber,
                        })

                        channel?.members?.forEach(member => {
                            if (!member.user.bot && member.user.id === value.userId.discordId) {
                                const embeds = new Discord.MessageEmbed()
                                    .setColor("RANDOM")
                                    .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
                                    .setTimestamp()
                                    .setImage("https://i.pinimg.com/originals/de/c6/5d/dec65d8008537d24c1341a76efb1dfec.gif")
                                    .setTitle(`Hi ${member.user.username}`)
                                    .setDescription(`Bạn đã quên checkout của ngày hôm nay 😔😔`)
                                member.send(embeds)
                            }
                        })
                    }
                })
            }, {
                scheduled: true,
                timezone: "Asia/Ho_Chi_Minh"
            });

            // Cập nhật điểm cho nhân viên
            cron.schedule(`0 0 23 * * 1-6`, async () => {
                const findStatisticTimeSheetModel: any = await TimeKeepingModel.find({
                    date: {
                        $regex: `.*/${new Date().getMonth() + 1}/${new Date().getFullYear()}$`
                    },
                })
                let statisticTimeSheets: StatisticTimeSheetItf = {};
                const date = findStatisticTimeSheetModel[0].date.split("/")[1] + "/" + findStatisticTimeSheetModel[0].date.split("/")[2];
                findStatisticTimeSheetModel.forEach((value: TimeSheetImportInf) => {
                    if (!statisticTimeSheets[`${value.userId}`]) {
                        statisticTimeSheets[`${value.userId}`] = {
                            successDaysNumber: 0,
                            lateDaysNumber: 0,
                            forgetDaysNumber: 0,
                            restDaysNumber: 0,
                            notEnoughtDaysNumber: 0,
                            notPassDaysNumber: 0,
                            workingNumber: 0,
                            date,
                            score: 100
                        }
                    }
                });

                findStatisticTimeSheetModel.forEach((value: TimeSheetImportInf) => {
                    statisticTimeSheets[`${value.userId}`].workingNumber += value.workingNumber;
                    if (value.type === KSInternalConfig.TIME_KEPPING_OK) {
                        statisticTimeSheets[`${value.userId}`].successDaysNumber += 1
                    } else if (value.type === KSInternalConfig.TIME_KEPPING_LATE) {
                        statisticTimeSheets[`${value.userId}`].lateDaysNumber += 1;
                        statisticTimeSheets[`${value.userId}`].score -= 1;
                    } else if (value.type === KSInternalConfig.TIME_KEPPING_FORGET) {
                        statisticTimeSheets[`${value.userId}`].forgetDaysNumber += 1;
                        statisticTimeSheets[`${value.userId}`].score -= 1;
                    } else if (value.type === KSInternalConfig.TIME_KEPPING_REST) {
                        statisticTimeSheets[`${value.userId}`].restDaysNumber += 1;
                        statisticTimeSheets[`${value.userId}`].score -= 1;
                    } else if (value.type === KSInternalConfig.TIME_KEEPING_NOT_ENOUGHT) {
                        statisticTimeSheets[`${value.userId}`].notEnoughtDaysNumber += 1;
                        statisticTimeSheets[`${value.userId}`].score -= 1;
                    } else if (value.type === KSInternalConfig.TIME_KEEPING_NOT_PASS) {
                        statisticTimeSheets[`${value.userId}`].notPassDaysNumber += 1
                        statisticTimeSheets[`${value.userId}`].score -= 2;
                    }
                });

                const res = await Promise.all(Object.keys(statisticTimeSheets).map(async (userId: string) => {
                    const findStatisticUser = await StatisticTimeSheetModel.findOne({
                        date: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                        userId
                    })

                    if (!findStatisticUser) {
                        await new StatisticTimeSheetModel({
                            ...statisticTimeSheets[userId],
                            userId
                        }).save();
                    } else {
                        StatisticTimeSheetModel.findOneAndUpdate({
                            date: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                            userId
                        }, {
                            ...statisticTimeSheets[userId],
                        });
                    }
                }))
            }, {
                scheduled: true,
                timezone: "Asia/Ho_Chi_Minh"
            });
        })

        const sendTasksToUser = async (findUser: any, status: string, message: any) => {
            if (findUser?.clickupId) {
                const list_task = await getApi({
                    url: "https://api.clickup.com/api/v2/team/25534334/task",
                    params: {
                        assignees: [findUser.clickupId],
                        subtasks: true,
                        statuses: [status],
                        order_by: "updated"
                    }
                });

                list_task.tasks.forEach(task => {
                    const embeds = new Discord.MessageEmbed()
                        .setColor(task.status.color)
                        .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
                        .setTimestamp()
                        .setURL(task.url)
                        .setAuthor(`${task.creator?.username} assigned to me`)
                        .setTitle(task.name)
                        .setDescription(task.due_date
                            ? `${task?.text_content || "Không có ghi chú"} 
                            \n - ***Estimate: ${moment(Number(task.due_date)).format("HH:mm DD/MM/YYYY")}***`
                            : `${task.text_content || "Không có ghi chú"} \n - ***Estimate: chưa cập nhật***`)
                    message.author?.send(embeds)
                })
                message.author?.send(`Bạn có tổng cộng ${list_task.tasks.length} task ${status}`)
            } else {
                message.author?.send(`Tài khoản của bạn không thể sử dụng lệnh này`)
            }
        }

        this.client.on("message", async message => {
            if (!message.author.bot && message.channel.type == "dm") {
                const userInfo = await UserModel.findOne({ status: 1, discordId: message.author.id });
                if (!userInfo) {
                    message.author.send("Tài khoản discord của bạn chưa được cập nhật trên hệ thống, vui lòng liên hệ assmin để được hỗ trợ https://facebook.com/duongchien15")
                } else {
                    if (message.content.toUpperCase() === "!CHECKIN") {
                        const findTimeKeeping = await TimeKeepingModel.findOne({
                            date: moment(new Date()).format("D/M/YYYY"),
                            userId: userInfo._id
                        })
                        if (findTimeKeeping) {
                            message.author.send("Checkin không thành công *(Bạn đã checkin rồi)*")
                        } else {
                            await new TimeKeepingModel({
                                userId: userInfo._id,
                                checkin: moment(new Date()).format("HH:mm"),
                                date: moment(new Date()).format("D/M/YYYY"),
                                workingType: KSInternalConfig.WORK_TYPE_ONLINE
                            }).save()
                            const embeds = new Discord.MessageEmbed()
                                .setColor("RANDOM")
                                .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
                                .setTimestamp()
                                .setImage("https://source.unsplash.com/random")
                                .setTitle(`Xin cảm ơn ${message.author.username}, bạn đã checkin lúc ${moment(new Date()).format("HH:mm DD/MM/YYYY")}`)
                                .setDescription(`Chúc bạn có một ngày làm việc hiệu quả`)
                            message.author.send(embeds);
                        }
                    } else if (message.content.toUpperCase() === "!CHECKOUT") {
                        // Kiểm tra nhân viên đã checkin hay chưa
                        const findTimeKeeping = await TimeKeepingModel.findOne({
                            date: moment(new Date()).format("D/M/YYYY"),
                            userId: userInfo._id
                        })

                        /**
                         * Nếu đã có bản ghi của ngày hôm đó thì có 2 TH:
                         * --- Đã chấm công OFFLINE ==> Bot thông báo: Checkin online không thành công
                         * --- Đã chấm công ONLINE ==> Cập nhật lại bản ghi đó: thêm trường checkout và tính các trạng thái workingNumber và type
                         */
                        if (findTimeKeeping) {
                            if (findTimeKeeping.workingType === KSInternalConfig.WORK_TYPE_OFFLINE || findTimeKeeping.checkout) {
                                message.author.send("Checkout không thành công *(Bạn đã checkout rồi)*")
                            } else {
                                const workingType = compareTime(findTimeKeeping.checkin, moment(new Date()).format("HH:mm"), userInfo);
                                const updateTimeSheet = await TimeKeepingModel.findOneAndUpdate(
                                    {
                                        date: moment(new Date()).format("D/M/YYYY"),
                                        userId: userInfo._id
                                    },
                                    {
                                        checkout: moment(new Date()).format("HH:mm"),
                                        type: workingType.type,
                                        workingNumber: workingType.workingNumber
                                    }
                                )
                                message.author.send(`Xin cảm ơn, bạn đã checkout lúc ${moment(new Date()).format("HH:mm DD/MM/YYYY")}`)
                            }
                        }
                        /**
                         * Nếu chưa có bản ghi đó trong DB ==> 
                         * --- Tạo bản ghi mới có trường checkout, tính các trạng thái workingNumber và type
                         * --- Bot thông báo bạn đã quên checkin của ngày hôm nay
                         */
                        else {
                            const workingType = compareTime("", moment(new Date()).format("HH:mm"), userInfo);
                            const createTimeSheet = await new TimeKeepingModel({
                                checkout: moment(new Date()).format("HH:mm"),
                                type: workingType.type,
                                workingNumber: workingType.workingNumber,
                                date: moment(new Date()).format("D/M/YYYY"),
                                workingType: KSInternalConfig.WORK_TYPE_ONLINE,
                                userId: userInfo?._id
                            }).save()
                            message.author.send(`Xin cảm ơn, bạn đã quên checkin của ngày hôm nay và checkout lúc ${moment(new Date()).format("HH:mm DD/MM/YYYY")}`)
                        }
                    } else if (message.content.toUpperCase() === "!TODO") {
                        const findUser = users.find(user => user.discordId === message.author.id);
                        sendTasksToUser(findUser, "to do", message)
                    } else if (message.content.toUpperCase() === "!INPROGRESS") {
                        const findUser = users.find(user => user.discordId === message.author.id);
                        sendTasksToUser(findUser, "in progress", message)
                    } else if (message.content.toUpperCase() === "!REVIEW") {
                        const findUser = users.find(user => user.discordId === message.author.id);
                        sendTasksToUser(findUser, "review", message)
                    } else if (message.content.toUpperCase() === "!COMPLETE") {
                        const findUser = users.find(user => user.discordId === message.author.id);
                        sendTasksToUser(findUser, "complete", message)
                    } else {
                        message.react("😡");
                        const embedTutorial = new Discord.MessageEmbed()
                            .setColor("RED")
                            .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
                            .setTimestamp()
                            .setTitle(`Hướng dẫn`)
                            .setDescription(`
                            \n- Xem danh sách công việc:
                                 + Các task todo: **!todo**
                                 + Các task inprogress: **!inprogress**
                                 + Các task review: **!review**
                                 + Các task complete: **!complete**
                            \n- Chấm công:
                                + Checkin: **!checkin**
                                + Checkout: **!checkout**
                                    `)
                        await message.author?.send(embedTutorial)
                    }
                }
            }

            // Xem tổng số thành viên tham gia channel
            if (message.content === "!showchannels") {
                this.client.guilds.cache.forEach(guild => {
                    message.channel.send(`${guild.name} có tổng cộng ${guild.memberCount} thành viên`)
                })
            }

            // Bot gửi tin nhắn và reaction
            // List emoji: https://emojipedia.org/
            // if (message.content.startsWith("!hello")) {
            //     helper(this.client, process.env.CHANNEL_ID, "Hello", ['🔥', '😊'])
            // }

            if (message.content.startsWith("!listMember")) {
                message.guild?.members.cache.forEach(async member => {
                    message.channel.send(`${member.user.username} + " " + ${member.user.id}`)
                })
            }

            if (message.content.toUpperCase().startsWith("!DATCOM") && message.author.id === process.env.ID_CHI_HUYEN && (message.channel.id === process.env.ORDER_CHANNEL_ID || message.channel.id === process.env.ORDER_CHANNEL_ID_ABC)) {
                setTimeout(() => message.delete(), 2000);
                const name_com = (message.content.trim().match(/^!datcom\s{1,}(.*)$/muiys) ?? [])[1] ?? '';
                const image = message.attachments.array()[0]?.url;
                const embeds = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setTimestamp()
                    .setTitle(`ĐẶT CƠM ${name_com}`)
                    .setDescription("@everyone Mọi người đặt cơm nhé")
                    .setThumbnail("https://storage.googleapis.com/ks-dev-elearning.appspot.com/dat-com.jpg")
                    .setImage(image)
                    .addFields([
                        { name: 'Món 1', value: `${_.repeat('⬛', 10)} | 0% (${0}) \n` },
                        { name: 'Món 2', value: `${_.repeat('⬛', 10)} | 0% (${0}) \n` },
                        { name: 'Món 3', value: `${_.repeat('⬛', 10)} | 0% (${0}) \n` },
                        { name: 'Món 4', value: `${_.repeat('⬛', 10)} | 0% (${0}) \n` },
                    ])
                    .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
                message.reply(embeds).then(async msg => {
                    await msg.react("1️⃣");
                    await msg.react("2️⃣");
                    await msg.react("3️⃣");
                    await msg.react("4️⃣");
                    await msg.react("📝");
                })
            }
        })

        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.channel.id === process.env.ORDER_CHANNEL_ID || reaction.message.channel.id === process.env.ORDER_CHANNEL_ID_ABC) {
                const timeNow = Date.now();
                const deadline = moment(reaction.message.createdTimestamp).set({ hour: 22, minute: 2, second: 2 }).valueOf();
                // Mỗi user chỉ vote đc 1 reaction
                if (!user.bot) {
                    reaction.message.reactions.cache.map(icon => {
                        if (icon._emoji.name != reaction._emoji.name && icon.users.cache.has(user.id) && reaction._emoji.name !== "📝") icon.users.remove(user.id)
                    })
                    if (reaction._emoji.name !== "📝") {
                        if (timeNow > deadline) {
                            const embeds = new Discord.MessageEmbed()
                                .setColor("RED")
                                .setTimestamp()
                                .setTitle(`Quá thời gian đặt cơm, báo lại assmin Huyền`)
                            await user.send(embeds).catch(console.error)
                        } else {
                            const embeds = new Discord.MessageEmbed()
                                .setColor("GREEN")
                                .setTimestamp()
                                .setTitle(`Bạn đã đặt món ${reaction._emoji.name} lúc ${moment(Date.now()).format("HH:mm DD/MM/YYYY")}`)
                            await user.send(embeds).catch(console.error)
                        }
                    }
                }

                let option_1, option_2, option_3, option_4;
                reaction.message.reactions.cache.forEach(icon => {
                    if (!user.bot) {
                        if (timeNow > deadline && reaction._emoji.name !== "📝") {
                            icon.users.remove(user);
                        }
                    }
                    switch (icon.emoji.name) {
                        case "1️⃣":
                            option_1 = icon.count === 1 ? 0 : icon.count - 1
                            break;
                        case "2️⃣":
                            option_2 = icon.count === 1 ? 0 : icon.count - 1
                            break;
                        case "3️⃣":
                            option_3 = icon.count === 1 ? 0 : icon.count - 1
                            break;
                        case "4️⃣":
                            option_4 = icon.count === 1 ? 0 : icon.count - 1
                            break;
                        case "📝":
                            if (icon.count > 1) {
                                if (user.id === process.env.ID_CHI_HUYEN) {
                                    const name = reaction.message.embeds[0]?.title;
                                    const embeds = new Discord.MessageEmbed()
                                        .setColor("RANDOM")
                                        .setTimestamp()
                                        .setTitle(`KẾT QUẢ: ${name}`)
                                        .addFields(reaction.message.reactions.cache.filter(({ emoji: { name } }) => name !== "📝").map((icon, key) => {
                                            return { name: `\n Món ${key}`, value: `Số lượng: ${icon.count - 1} \n` }
                                        }))
                                        .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
                                    user.createDM().then((dmChannel) => {
                                        dmChannel.send(embeds);
                                    })
                                }
                                icon.users.remove(user);
                            }
                            break;
                    }
                })

                const sum_voting = option_1 + option_2 + option_3 + option_4;
                // const getResultOption = (option, type) => {
                //     return `${_.repeat('🍺', option || 0)}${_.repeat('⬛', Math.abs(10 - (option || 0)))} | ${(sum_voting ? (option / sum_voting) * 100 : 0).toFixed(2)}% (${option || 0}) \n`
                // }

                const getResultOption = (option, type) => {
                    switch (type) {
                        case 1:
                            return `${_.repeat('🍱', option || 0)}${_.repeat('⬛', Math.abs(10 - (option || 0)))} | ${(sum_voting ? (option / sum_voting) * 100 : 0).toFixed(2)}% (${option || 0}) \n`;
                        case 2:
                            return `${_.repeat('🥗', option || 0)}${_.repeat('⬛', Math.abs(10 - (option || 0)))} | ${(sum_voting ? (option / sum_voting) * 100 : 0).toFixed(2)}% (${option || 0}) \n`;
                        case 3:
                            return `${_.repeat('🍣', option || 0)}${_.repeat('⬛', Math.abs(10 - (option || 0)))} | ${(sum_voting ? (option / sum_voting) * 100 : 0).toFixed(2)}% (${option || 0}) \n`;
                        case 4:
                            return `${_.repeat('🍵', option || 0)}${_.repeat('⬛', Math.abs(10 - (option || 0)))} | ${(sum_voting ? (option / sum_voting) * 100 : 0).toFixed(2)}% (${option || 0}) \n`;
                    }
                }

                reaction.message.channel.messages.fetch(reaction.message.id).then(msg => {
                    const name_com = msg.embeds[0]?.title.split(" ")[2];
                    const image = msg.embeds[0]?.image?.url;
                    const embeds = new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setTimestamp()
                        .setTitle(`ĐẶT CƠM ${name_com}`)
                        .setDescription("@everyone Mọi người đặt cơm nhé")
                        .setThumbnail("https://storage.googleapis.com/ks-dev-elearning.appspot.com/dat-com.jpg")
                        .setImage(image)
                        .addFields([
                            { name: 'Món 1', value: getResultOption(option_1, 1) },
                            { name: 'Món 2', value: getResultOption(option_2, 2) },
                            { name: 'Món 3', value: getResultOption(option_3, 3) },
                            { name: 'Món 4', value: getResultOption(option_4, 4) },
                        ])
                        .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
                    msg.edit(embeds)
                })
            }
        })

        this.client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.channel.id === process.env.ORDER_CHANNEL_ID || reaction.message.channel.id === process.env.ORDER_CHANNEL_ID_ABC) {
                let option_1, option_2, option_3, option_4;
                const timeNow = Date.now();
                const deadline = moment(reaction.message.createdTimestamp).set({ hour: 22, minute: 2, second: 2 }).valueOf();
                if (!user.bot) {
                    if (reaction._emoji.name !== "📝") {
                        if (timeNow > deadline) {
                            const embeds = new Discord.MessageEmbed()
                                .setColor("RED")
                                .setTimestamp()
                                .setTitle(`Quá thời gian thay đổi đặt cơm, báo lại assmin Huyền`)
                            await user.send(embeds).catch(console.error)
                        }
                    }
                    // else {
                    //     const embeds = new Discord.MessageEmbed()
                    //         .setColor("BLUE")
                    //         .setTimestamp()
                    //         .setTitle(`Bạn đã hủy đặt món ${reaction._emoji.name} lúc ${moment(Date.now()).format("HH:mm DD/MM/YYYY")}`)
                    //     await user.send(embeds).catch(console.error)
                    // }
                }
                reaction.message.reactions.cache.forEach(icon => {
                    switch (icon.emoji.name) {
                        case "1️⃣":
                            option_1 = icon.count === 1 ? 0 : icon.count - 1
                            break;
                        case "2️⃣":
                            option_2 = icon.count === 1 ? 0 : icon.count - 1
                            break;
                        case "3️⃣":
                            option_3 = icon.count === 1 ? 0 : icon.count - 1
                            break;
                        case "4️⃣":
                            option_4 = icon.count === 1 ? 0 : icon.count - 1
                            break;
                    }
                })

                const sum_voting = option_1 + option_2 + option_3 + option_4;
                const getResultOption = (option, type) => {
                    switch (type) {
                        case 1:
                            return `${_.repeat('🍱', option || 0)}${_.repeat('⬛', Math.abs(10 - (option || 0)))} | ${(sum_voting ? (option / sum_voting) * 100 : 0).toFixed(2)}% (${option || 0}) \n`;
                        case 2:
                            return `${_.repeat('🥗', option || 0)}${_.repeat('⬛', Math.abs(10 - (option || 0)))} | ${(sum_voting ? (option / sum_voting) * 100 : 0).toFixed(2)}% (${option || 0}) \n`;
                        case 3:
                            return `${_.repeat('🍣', option || 0)}${_.repeat('⬛', Math.abs(10 - (option || 0)))} | ${(sum_voting ? (option / sum_voting) * 100 : 0).toFixed(2)}% (${option || 0}) \n`;
                        case 4:
                            return `${_.repeat('🍵', option || 0)}${_.repeat('⬛', Math.abs(10 - (option || 0)))} | ${(sum_voting ? (option / sum_voting) * 100 : 0).toFixed(2)}% (${option || 0}) \n`;
                    }
                }

                reaction.message.channel.messages.fetch(reaction.message.id).then(async msg => {
                    const name_com = msg.embeds[0]?.title.split(" ")[2];
                    const image = msg.embeds[0]?.image?.url || "";
                    const embeds = new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setTimestamp()
                        .setTitle(`ĐẶT CƠM ${name_com}`)
                        .setDescription("@everyone Mọi người đặt cơm nhé")
                        .setThumbnail("https://storage.googleapis.com/ks-dev-elearning.appspot.com/dat-com.jpg")
                        .setImage(image)
                        .addFields([
                            { name: 'Món 1', value: getResultOption(option_1, 1) },
                            { name: 'Món 2', value: getResultOption(option_2, 2) },
                            { name: 'Món 3', value: getResultOption(option_3, 3) },
                            { name: 'Món 4', value: getResultOption(option_4, 4) },
                        ])
                        .setFooter("© Koolsoft", "https://storage.googleapis.com/ks-dev-elearning.appspot.com/ks-logo.png")
                    msg.edit(embeds)
                })
                // }
            }
        })

        // this.client.on("guildMemberAdd", member => {
        //     helper(
        //         this.client,
        //         process.env.CHANNEL_ID,
        //         `Hi mn @everyone! Hôm nay công ty mình có thêm thành viên mới, là bạn <@${member.id}>.`,
        //         ['🔥', '😊', '🥰', '😍', '❤️', '🫀', '💗', '💘']
        //     );
        // })

        this.client.login(process.env.TOKEN);
    }
}