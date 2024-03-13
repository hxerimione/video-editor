import { useContext, useEffect, useRef, useState } from 'react';
import styles from './VideoEditor.module.css';
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { Button, Toast, Modal, Spinner, ToastContainer } from 'react-bootstrap';
import video_placeholder from '../../assets/images/editor/video_placeholder.png';
import VideoPlayer from './VideoPlayer';
import MultiRangeSlider from '../../components/MultiRangeSlider';
import VideoConversionButton from './VideoConversionButton';
import { sliderValueToVideoTime } from '../../utils/utils';

const ffmpeg = createFFmpeg({ log: true });
const VideoEditor = () => {
    // const val = useContext(RangeContext);
    const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
    const [uploadCount, setUploadCount] = useState(0);
    const [videoFile, setVideoFile] = useState();
    const [videoPlayerState, setVideoPlayerState] = useState();
    const [videoPlayer, setVideoPlayer] = useState();
    const [sliderValues, setSliderValues] = useState([0, 100]);
    const [processing, setProcessing] = useState(false);
    const [show, setShow] = useState(false);
    const uploadFile = useRef('');
    useEffect(() => {
        ffmpeg.load().then(() => {
            setFFmpegLoaded(true);
        });
    }, []);
    useEffect(() => {
        const min = sliderValues[0];
        if (min !== undefined && videoPlayerState && videoPlayer) {
            videoPlayer.seek(
                sliderValueToVideoTime(videoPlayerState.duration, min)
            );
        }
    }, [sliderValues]);
    useEffect(() => {
        if (videoPlayer && videoPlayerState) {
            const [min, max] = sliderValues;

            const minTime = sliderValueToVideoTime(
                videoPlayerState.duration,
                min
            );
            const maxTime = sliderValueToVideoTime(
                videoPlayerState.duration,
                max
            );
            if (
                videoPlayerState.currentTime < minTime ||
                videoPlayerState.currentTime > maxTime
            ) {
                videoPlayer.seek(minTime);
            }
        }
    }, [videoPlayerState]);
    useEffect(() => {
        if (!videoFile) {
            setVideoPlayerState(undefined);
        }
        setUploadCount(uploadCount + 1);
        // setSliderValues([0, 100]);

        // onChange({ min: 0, max: 100 });
    }, [videoFile]);
    return (
        <article className={styles.layout}>
            <div className={styles.editor_container}>
                <h1 className={styles.title}>비디오 편집</h1>

                {videoFile && (
                    <div>
                        <input
                            onChange={(e) => setVideoFile(e.target.files[0])}
                            type="file"
                            accept="video/*"
                            ref={uploadFile}
                            style={{ display: 'none' }}
                        />
                        <Button
                            className={styles.re__upload__btn}
                            onClick={() => uploadFile.current.click()}
                            style={{ width: 'fit-content' }}
                        >
                            비디오 재선택
                        </Button>
                    </div>
                )}
            </div>
            <section>
                {videoFile ? (
                    <VideoPlayer
                        src={videoFile}
                        onPlayerChange={(videoPlayer) => {
                            setVideoPlayer(videoPlayer);
                        }}
                        onChange={(videoPlayerState) => {
                            setVideoPlayerState(videoPlayerState);
                        }}
                    />
                ) : (
                    <div className={styles.upload_container}>
                        <img
                            src={video_placeholder}
                            width="100%"
                            // heigh="100%"
                            alt="비디오를 입력하세요"
                        />
                        <input
                            onChange={(e) => setVideoFile(e.target.files[0])}
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            ref={uploadFile}
                        />
                        <Button
                            className={styles.upload__btn}
                            onClick={() => uploadFile.current.click()}
                        >
                            비디오 업로드하기
                        </Button>
                    </div>
                )}
            </section>

            {videoFile && (
                <section>
                    <MultiRangeSlider
                        // min={sliderValues[0]}
                        // max={sliderValues[1]}
                        min={0}
                        max={100}
                        onChange={({ min, max }) => {
                            setSliderValues([min, max]);
                        }}
                        count={uploadCount}
                    />

                    <VideoConversionButton
                        videoPlayerState={videoPlayerState}
                        sliderValues={sliderValues}
                        videoFile={videoFile}
                        ffmpeg={ffmpeg}
                        onConversionStart={() => {
                            setProcessing(true);
                        }}
                        onConversionEnd={() => {
                            setProcessing(false);
                            setShow(true);
                        }}
                    />
                </section>
            )}
            {/* <ToastContainer
                className="p-3"
                position={'top-center'}
                style={{ zIndex: 1 }}
            >
                <Toast
                    onClose={() => setShow(false)}
                    show={show}
                    delay={2000}
                    bg="dark"
                    autohide
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Video Editor</strong>
                    </Toast.Header>
                    <Toast.Body>내보내기가 완료되었습니다.</Toast.Body>
                </Toast>
            </ToastContainer>

            <Modal
                show={processing}
                onHide={() => setProcessing(false)}
                backdrop={false}
                keyboard={false}
                centered
                size="sm"
            >
                <div style={{ textAlign: 'center' }}>
                    <Spinner
                        animation="border"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>

                    <p
                        style={{
                            marginTop: 16,
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#c8c8c8',
                        }}
                    >
                        내보내기가 진행중입니다.
                    </p>
                </div>
            </Modal> */}
        </article>
    );
};
export default VideoEditor;
