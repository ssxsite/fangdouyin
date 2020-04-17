<template>
    <div class="container_box" id="video_box">
        <div class="van_swipe">
            <!--vant van-swipe 滑动组件 -->
            <van-swipe :show-indicators="false" @change="onChange" vertical :loop="true" :initial-swipe="current">
                <van-swipe-item v-for="(item, index) in videoList" :key="index" class="product_swiper">
                    <div class="video_container">
                        <!--                        style="position: relative;"-->
                        <!--video属性videoList
                             webkit-playsinline ios 小窗播放，使视频不脱离文本流，安卓则无效
                             微信内置x5内核，
                             x5-video-player-type="h5-page" 启用H5播放器,是wechat安卓版特性，添加此属性，微信浏览器会自动将视频置为全屏
                             x5-video-player-fullscreen="true" 全屏设置，设置为 true 是防止横屏
                             x5-video-orientation 控制横竖屏 landscape 横屏，portrain竖屏； 默认portrain
                             poster：封面
                             src：播放地址
                             -->
                        <video class="video_box"
                               webkit-playsinline="true"
                               playsinline="true"
                               x-webkit-airplay="allow"
                               x5-video-player-type="h5-page"
                               preload="auto"
                               :poster="item.cover"
                               :playOrPause="playOrPause"
                               @click="pauseVideo" @ended="onPlayerEnded($event)"
                               :src="item.url"
                        >
                            您的浏览器不支持播放该视频！
                        </video>

                        <!-- 封面 -->
                        <img v-show="isVideoShow" class="play" @click="playvideo" :src="item.cover"/>
                        <!-- 播放暂停按钮 -->
                        <img v-show="iconPlayShow" id="icon_play" class="icon_play" @click="playvideo"
                             src="http://npjy.oss-cn-beijing.aliyuncs.com/images/file-1575340653940esdHR.png"/>
                    </div>
                    <!-- 右侧头像、点赞、评论、分享功能 -->
                    <div class="tools_right">
                        <div class="tools_r_li" @click="gotoVideoList">
                            <img src="/assets/img/newSafety/police.png" class="tag1">
                            <div class="tools_r_num">警方说</div>
                        </div>
                        <!-- 点赞，后期做 -->
<!--                        <div class="tools_r_li" @click="changeFabulous(item,index)">-->
<!--                            <img src="/assets/img/newSafety/good.png" :class="['tag2',fabulous ? 'fabulous_active':'']">-->
<!--                            <div class="tools_r_num">{{item.love_num}}</div>-->
<!--                        </div>-->
                    </div>
                    <div class="production_box">
                        {{item.title}}
                    </div>
                </van-swipe-item>
            </van-swipe>
            <!--底部操作栏-->
            <div class="container_bottom">
                <div class="time" v-show="show_time">
                    <span class="current">00:00</span> / <span class="totle">00:30</span>
                </div>
                <div class="progress">
                    <div class="border_progress" :style="'width:'+videoProcess+'px'"></div>
                    <!--                    <i class="duration-icon" :style="`left:${videoProcess -12}px`" v-show="videoProcess > 16"></i>-->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from "vue";
    import {
        Swipe,
        SwipeItem,
        Toast
    } from "vant";

    Vue.use(Swipe, Toast).use(SwipeItem);
    let videoProcessInterval;
    export default {
        name: "videoPlayer",
        data() {
            let u = navigator.userAgent;
            return {
                current: 0,
                videoList: [],
                isVideoShow: true,
                playOrPause: true,
                video: null,
                iconPlayShow: true,
                isAndroid: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, // android终端
                isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                tabIndex: 0,
                videoProcess: 0,//视频播放进度
                show_time: false,
                fabulous: false
            };
        },
        created() {
            this.getVideoData();
        },

        beforeRouteLeave(to, from, next) {
            this.clearVideo();
            setTimeout(() =>{
                next();
            },500)
        },
        methods: {
            gotoVideoList() {
                this.$router.push('/videoList');
            },
            //改变收藏状态
            changeFabulous(item, index) {
                if (this.fabulous === true) {
                    return;
                }
                this.fabulous = true;
                setTimeout(() => {//模拟网络请求
                    this.videoList[index].love_num++;
                    this.fabulous = false;
                }, 200);
            },
            //滑动改变播放的视频
            onChange(index) {
                //改变的时候 暂停当前播放的视频
                clearInterval(videoProcessInterval);
                this.videoProcess = 0;
                let video = document.querySelectorAll("video")[this.current];
                video.currentTime = 0;
                video.pause();
                this.playOrPause = false;
                this.current = index;
                this.playOrPause = true;
                this.iconPlayShow = true;
                this.isVideoShow = true;
                this.show_time = false;
            },
            // 开始播放
            playvideo(event) {
                let video = document.querySelectorAll("video")[this.current];
                this.isVideoShow = false;
                this.iconPlayShow = false;
                video.play();
                window.onresize = function () {
                    video.style.width = window.innerWidth + "px";
                    video.style.height = window.innerHeight + "px";
                };
                videoProcessInterval = setInterval(() => {
                    this.changeProcess(video);
                }, 100);
                // this.getVideoDuration();
                // this.show_time = true;
            },

            pauseVideo() { //暂停\播放
                try {
                    let video = document.querySelectorAll("video")[this.current];
                    if (this.playOrPause) {
                        video.pause();
                        this.iconPlayShow = true;
                        clearInterval(videoProcessInterval);
                    } else {
                        video.play();
                        video.pause();
                        setTimeout(() => {
                            video.play();
                            this.iconPlayShow = false;
                            videoProcessInterval = setInterval(() => {
                                this.changeProcess(video);
                            }, 100);
                        }, 100);
                    }
                    this.playOrPause = !this.playOrPause;
                    // this.getVideoDuration();
                } catch (e) {
                    alert(e);
                }
            },

            //记录播放进度
            changeProcess() {
                let progress = document.querySelector('.progress');
                let video = document.querySelectorAll("video")[this.current];
                let currentTime = video.currentTime.toFixed(1);
                let duration = video.duration.toFixed(1);
                this.videoProcess = (currentTime / duration) * progress.offsetWidth;
            },

            onPlayerEnded(player) { //视频结束
                this.isVideoShow = true;
                this.iconPlayShow = true;
            },
            //获取视频时间进度
            getVideoDuration() {
                let video = document.querySelectorAll("video")[this.current];
                let current = document.querySelector('.time .current');
                let total = document.querySelector('.time .totle');
                if(video){
                    let total_time = video.duration;//视频总时长
                    let m = parseInt(total_time / 60); //分
                    let s = parseInt(total_time % 60); //秒
                    m = m >= 10 ? m : "0" + m;
                    s = s >= 10 ? s : "0" + s;
                    total.innerHTML = m + ":" + s;
                    let current_time = 0;
                    video.addEventListener('timeupdate', function () {
                        current_time = this.currentTime;
                        let _m = parseInt(current_time / 60); //分
                        let _s = parseInt(current_time % 60); //秒
                        _m = _m >= 10 ? _m : "0" + _m;
                        _s = _s >= 10 ? _s : "0" + _s;
                        current.innerHTML = _m + ":" + _s;
                    });
                }
            },

            getVideoData() {
                setTimeout(() => {
                    this.videoList = [
                        {
                            video_id: 5,
                            url: "/assets/img/newSafety/video5.mp4",//视频源
                            cover: "/assets/img/newSafety/video5.jpg",//封面
                            fabulous: false,//是否赞过
                            author_id: 3,//作者ID
                            title: "惊！分期乐居然有假的？？？",
                            date: "2020/4/17",
                            love_num: 999
                        },
                        {
                            video_id: 1,
                            url: "/assets/img/newSafety/video3.mp4",//视频源
                            cover: "/assets/img/newSafety/video3.jpg",//封面
                            fabulous: false,//是否赞过
                            author_id: 3,//作者ID
                            title: "#清空额度#是套路，让你转账把你骗",
                            date: "2020/4/7",
                            love_num: 999
                        },
                        {
                            video_id: 2,
                            url: "/assets/img/newSafety/video2~1.mp4",//视频源
                            cover: "/assets/img/newSafety/video2.jpg",//封面
                            fabulous: false,//是否赞过
                            author_id: 2,//作者ID
                            title: "影响征信？骗你转钱？看看怎么回事#影响征信莫当真#",
                            date: "2020/3/7",
                            love_num: 1000
                        },
                        {
                            video_id: 3,
                            url: "/assets/img/newSafety/video1~1.mp4",//视频源
                            cover: "/assets/img/newSafety/video1.jpg",//封面
                            fabulous: false,//是否赞过
                            author_id: 1,//作者ID
                            title: "#注销账号#不可靠，多方核实莫掉坑",
                            date: "2020/2/17",
                            love_num: 996
                        },
                        {
                            video_id: 4,
                            url: "/assets/img/newSafety/video4.mp4",//视频源
                            cover: "/assets/img/newSafety/video4.jpg",//封面
                            fabulous: false,//是否赞过
                            tagFollow: false,//是否关注过该作者
                            author_id: 1,//作者ID
                            title: "春节诈骗高发期，在这给您提个醒儿#春节防诈骗指南",
                            date: "2020/1/16",
                            love_num: 928
                        }
                    ];
                    let video_len = this.videoList.length;
                    let video_id = this.$route.query.video_id;
                    for (let i = 0; i < video_len; i++) {
                        if ('' + this.videoList[i].video_id === video_id) {
                            this.current = i;
                            break;
                        }
                    }
                }, 100);
            },

            clearVideo() {
                let video = document.querySelectorAll("video")[this.current];
                if (this.playOrPause) {
                    video.pause();
                    this.iconPlayShow = true;
                }
                clearInterval(videoProcessInterval);
            }
        }

    };
</script>
<style lang="scss" scoped>
    .container_box {
        width: 100%;
        height: 100%;
        background: #000;

        .van_swipe {
            width: 100vw;
            height: 100vh;
            max-width: 550px;
            margin: 0 auto;
            position: relative;

            .product_swiper {
                width: 100%;

                .video_container {
                    .video_box {
                        object-fit: fill !important;
                        z-index: 999;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        overflow: hidden;
                    }
                }

                video {
                    object-position: 0 0;
                }

                .play {
                    position: absolute;
                    margin: auto;
                    top: 0;
                    left: 0;
                    z-index: 1001;
                    width: 100%;
                    height: 100%;
                }

                .icon_play {
                    position: absolute;
                    top: 50%;
                    right: 0;
                    left: 0;
                    bottom: auto;
                    margin: -30px auto 0;
                    z-index: 1002;
                    height: 60px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                }
            }

            .van-swipe {
                width: 100%;
                height: 100%;
            }
        }

        .tools_right {
            z-index: 1002;
            position: absolute;
            right: 16px;
            bottom: 3rem;

            .tools_r_li {
                margin-bottom: .4rem;
                color: #fff;
                text-align: center;
                font-size: .24rem;

                &:last-child {
                    margin-bottom: 0px;
                }

                .tag1 {
                    width: .88rem;
                    height: .88rem;
                }

                .tag2 {
                    width: .72rem;
                    height: .66rem;
                }

                .fabulous_active {
                    color: #f44;
                    animation: showHeart .5s ease-in-out 0s;
                }
            }
        }

        @keyframes showHeart {
            0% {
                color: #f44;
                transform: scale(1);
            }

            25% {
                color: #fff;
                transform: scale(0);
            }

            80% {
                color: #f44;
                transform: scale(1.2);
            }

            100% {
                color: #f44;
                transform: scale(1);
            }
        }

        .production_box {
            z-index: 1001;
            position: absolute;
            bottom: 1.52rem;
            text-align: left;
            color: #fff;
            width: 90%;
            left: .32rem;
            font-size: 0.28rem;
            box-sizing: border-box;
        }

        .container_bottom {
            position: fixed;
            bottom: 0;
            width: 100%;
            height: .58rem;
            max-width: 550px;

            .time {
                position: absolute;
                height: .4rem;
                width: 2rem;
                text-align: right;
                padding-right: 10px;
                top: -.4rem;
                right: 0;
                color: #ffffff;
                font-size: .28rem;
            }

            .progress {
                position: relative;
                background-color: #979797;
                height: 2px;

                .border_progress {
                    width: 0;
                    height: 2px;
                    background: #FFFFFF;
                    position: absolute;
                    top: 0px;
                    transition: .1s all;
                }

                .duration-icon {
                    width: 12px;
                    height: 12px;
                    background-color: #FFFFFF;
                    border-radius: 50%;
                    position: absolute;
                    left: 0;
                    top: -5px;
                }
            }
        }
    }
</style>
