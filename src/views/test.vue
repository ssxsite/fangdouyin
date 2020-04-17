<template>
    <div class="container_box" id="video_box">
        <div class="van_swipe">
            <!--vant van-swipe 滑动组件 -->
            <van-swipe :show-indicators="false" @change="onChange" vertical :loop="true">
                <van-swipe-item v-for="(item, index) in videoList" :key="index" class="product_swiper">
                    <div class="video_container" >
                        <!--                        style="position: relative;"-->
                        <!--video属性
                             webkit-playsinline ios 小窗播放，使视频不脱离文本流，安卓则无效
                             微信内置x5内核，
                             x5-video-player-type="h5-page" 启用H5播放器,是wechat安卓版特性，添加此属性，微信浏览器会自动将视频置为全屏
                             x5-video-player-fullscreen="true" 全屏设置，设置为 true 是防止横屏
                             x5-video-orientation 控制横竖屏 landscape 横屏，portrain竖屏； 默认portrain
                             poster：封面
                             src：播放地址
                             -->
                        <video class="video_box"  webkit-playsinline="true"
                               playsinline="true"
                               x-webkit-airplay="allow"
                               x5-video-player-type="h5-page"
                               x5-video-player-fullscreen="true"
                               x5-video-orientation="portraint"
                               :poster="item.cover" :src="item.url" :playOrPause="playOrPause"
                               @click="pauseVideo" @ended="onPlayerEnded($event)"
                        >
                        </video>

                        <!-- 封面 -->
                        <!--                        <img v-show="isVideoShow" class="play" @click="playvideo" :src="item.cover"/>-->
                        <!-- 播放暂停按钮 -->
                        <img v-show="iconPlayShow" class="icon_play" @click="playvideo"
                             src="http://npjy.oss-cn-beijing.aliyuncs.com/images/file-1575340653940esdHR.png"/>
                    </div>
                    <!-- 右侧头像、点赞、评论、分享功能 -->
                    <div class="tools_right">
                        <div class="tools_r_li">
                            <img :src="item.tag_image" class="tag_image">
                            <router-link to="/videoList" class="tools_r_num" tag="div">警方说</router-link>
                        </div>
                        <div class="tools_r_li" @click="changeFabulous(item,index)">
                            <i class="iconfont icon-shoucang icon_right"
                               :class="item.fabulous?'fabulous_active':''"></i>
                            <div class="tools_r_num">52.1w</div>
                        </div>
                    </div>
                    <!-- 底部作品描述 -->
                    <div class="production_box">
                        <div class="production_name">
                            @{{item.author}}
                        </div>
                    </div>
                </van-swipe-item>
            </van-swipe>
            <!--底部操作栏-->
            <div class="container_bottom">
                <div class="border_progress" :style="'width:'+videoProcess+'%'"></div>
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
    // // 引入微信分享
    // import wx from "weixin-js-sdk";

    Vue.use(Swipe, Toast).use(SwipeItem);

    let videoProcessInterval;
    export default {
        name: "videoPlayer",
        data() {
            let u = navigator.userAgent;
            return {
                current: 0,
                videoList:[],
                isVideoShow: true,
                playOrPause: true,
                video: null,
                iconPlayShow: true,
                isAndroid: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, // android终端
                isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                tabIndex: 0,
                videoProcess: 0//视频播放进度
            };
        },
        watch: {
            //监听输入变化
            comment_text(newV, oldV) {
                newV == "" ? this.canSend = false : this.canSend = true;
            }
        },
        created(){
            setTimeout(() =>{
                this.videoList = [
                    {
                        url: "http://video.jishiyoo.com/3720932b9b474f51a4cf79f245325118/913d4790b8f046bfa1c9a966cd75099f-8ef4af9b34003bd0bc0261cda372521f-ld.mp4",//视频源
                        cover: "http://oss.jishiyoo.com/images/file-1575341210559.png",//封面
                        tag_image: "http://npjy.oss-cn-beijing.aliyuncs.com/images/file-1575449277018pF3XL.jpg",//作者头像
                        fabulous: false,//是否赞过
                        tagFollow: false,//是否关注过该作者
                        author_id: 1,//作者ID
                        author: "superKM",
                        des: "武汉加油"
                    }, {
                        url: "http://video.jishiyoo.com/1eedc49bba7b4eaebe000e3721149807/d5ab221b92c74af8976bd3c1473bfbe2-4518fe288016ee98c8783733da0e2da4-ld.mp4",
                        cover: "http://oss.jishiyoo.com/images/file-1575343195934.jpg",
                        tag_image: "http://npjy.oss-cn-beijing.aliyuncs.com/images/file-1575449298299M3V50.jpg",
                        fabulous: true,//是否赞过
                        tagFollow: false,//是否关注过该作者
                        author_id: 2,//作者ID
                        author: "superKM",
                        des: "中国加油"
                    }, {
                        url: "http://video.jishiyoo.com/161b9562c780479c95bbdec1a9fbebcc/8d63913b46634b069e13188b03073c09-d25c062412ee3c4a0758b1c48fc8c642-ld.mp4",
                        cover: "http://oss.jishiyoo.com/images/file-1575343262684.jpg",
                        tag_image: "http://npjy.oss-cn-beijing.aliyuncs.com/images/file-1575449277018pF3XL.jpg",
                        fabulous: false,//是否赞过
                        tagFollow: false,//是否关注过该作者
                        author_id: 1,//作者ID
                        author: "superKM",
                        des: "武汉加油"
                    }, {
                        url: "http://video.jishiyoo.com/549ed372c9d14b029bfb0512ba879055/8e2dc540573d496cb0942273c4a4c78c-15844fe70971f715c01d57c0c6595f45-ld.mp4",
                        cover: "http://oss.jishiyoo.com/images/file-1575343508574.jpg",
                        tag_image: "http://npjy.oss-cn-beijing.aliyuncs.com/images/file-1575449277018pF3XL.jpg",
                        fabulous: false,//是否赞过
                        tagFollow: false,//是否关注过该作者
                        author_id: 1,//作者ID
                        author: "superKM",
                        des: "中国加油"
                    }]
            },500)
        },
        mounted() {
            // wx.config({
            //   debug: false,
            //   appId: "111",
            //   timestamp: "111",
            //   nonceStr: "111",
            //   signature: "111",
            //   jsApiList: []
            // });
        },
        methods: {
            //改变收藏状态
            changeFabulous(item, index) {
                this.videoList[index].fabulous = !this.videoList[index].fabulous;
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
                //非ios切换直接自动播放下一个
                if (!this.isiOS) {
                    this.isVideoShow = false;
                    setTimeout(() => {
                        this.pauseVideo();
                    }, 100);
                } else {
                    //ios官方禁止video自动播放，未找到合适的方法，如果您发现了，麻烦告诉我一下谢谢啦
                    this.playOrPause = true;
                    this.iconPlayShow = true;
                }
            },
            // 开始播放
            playvideo(event) {
                let video = document.querySelectorAll("video")[this.current];
                console.log("playvideo：" + this.current);
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
            },
            pauseVideo() { //暂停\播放
                try {
                    let video = document.querySelectorAll("video")[this.current];
                    console.log("pauseVideo" + this.current);
                    if (this.playOrPause) {
                        video.pause();
                        this.iconPlayShow = true;
                        clearInterval(videoProcessInterval);
                    } else {
                        // wx.ready(() => {
                        //     // 在微信的ready中进行播放 不管成功配置与否 都会执行ready
                        //     video.play();
                        // })
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
                } catch (e) {
                    alert(e);
                }


            },
            //记录播放进度
            changeProcess() {
                let video = document.querySelectorAll("video")[this.current];
                let currentTime = video.currentTime.toFixed(1);
                let duration = video.duration.toFixed(1);
                this.videoProcess = parseInt((currentTime / duration).toFixed(2) * 100);
            },
            onPlayerEnded(player) { //视频结束
                this.isVideoShow = true;
                this.iconPlayShow = true;
                // this.current += this.current;
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
                    /*display: flex;*/
                    /*height: 100%;*/
                    /*align-items: center;*/
                    /*justify-content: center;*/
                    /*text-align: justify;*/
                    /*background: #000;*/
                    /*margin: 0 auto;*/
                    /*color: #fff;*/
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
                    z-index: 999;
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
                    z-index: 999;
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
    }


    /*头像， 点赞*/
    .tag_image {
        width: 50px;
        height: 50px;
        border: 1px solid #fff;
        box-sizing: border-box;
        border-radius: 50%;
        margin-bottom: 20px;
        position: relative;
        box-shadow: 0px 0px 10px #9d9d9d;
    }

    .tools_right {
        z-index: 1001;
        position: absolute;
        right: 16px;
        bottom: 180px;
        .tools_r_li {
            margin-bottom: 20px;
            color: #fff;
            font-size: 14px;
            position: relative;
        }
        .tools_r_li:last-child {
            margin-bottom: 0px;
        }
        .icon_right {
            margin-bottom: 5px;
            font-size: 42px;
            display: block;
            text-shadow: 0px 0px 10px #9d9d9d;
            /*transition: .5s;*/
        }
        .icon-shoucang {
            transition: .5s all;
        }
        .fabulous_active {
            color: #f44;
            animation: showHeart .5s ease-in-out 0s;
        }
    }


    /*animation-name：用来调用@keyframes定义好的动画，与@keyframes定义的动画名称一致*/
    /*animation-duration ：指定元素播放动画所持续的时间*/
    /*animatino-timing-function ： 和transition中的transition-timing-function 中的值一样。根据上面@keframes中分析的animation中可能存在多个小动画，因此这里的值设置是针对每一个小动画所在时间范围内的属性变换速率。*/
    /*animation-delay：定义在浏览器开始执行动画之前等待的时间，这里是指整个animation执行之前的等待时间，而不是上面说的多个小动画*/
    /*animation-iteration-count：定义动画的播放次数，其通常为整数，默认是1,；取值为infinite，动画将无限次的播放。*/
    /*animation-direction：主要用来设置动画播放方向*/
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
        bottom: .48rem;
        text-align: left;
        padding: 0 15px 15px 15px;
        color: #fff;
        width: 100%;
        left: 0;
        box-sizing: border-box;
        .production_name {
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 10px;
        }
    }
    .container_bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 48px;
        max-width: 550px;
        .border_progress {
            width: 0;
            height: 1px;
            background: #bababa;
            position: absolute;
            top: 0;
            transition: .1s all;
        }
    }

</style>
