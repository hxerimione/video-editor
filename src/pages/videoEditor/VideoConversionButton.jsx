import { Button } from 'antd';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { readFileAsBase64, sliderValueToVideoTime } from '../../utils/utils';
import out from '../../assets/icons/out.svg';
import dark_download from '../../assets/icons/dark_download.svg';

function VideoConversionButton({
    videoPlayerState,
    sliderValues,
    videoFile,
    ffmpeg,
    onConversionStart = () => {},
    onConversionEnd = () => {},
}) {
    const convertToGif = async () => {
        onConversionStart(true);

        const inputFileName = 'input.mp4';
        const outputFileName = 'output.gif';

        ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

        const [min, max] = sliderValues;
        const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
        const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

        const width = 1280;
        const length = 720;
        console.log(minTime, maxTime);
        await ffmpeg.run(
            '-i',
            inputFileName,
            '-ss',
            `${minTime}`,
            '-t',
            `${maxTime - minTime}`,
            '-f',
            'gif',
            '-r',
            '20',
            '-vf',
            `scale=in_w/4:in_h/4`,
            outputFileName
        );

        const data = ffmpeg.FS('readFile', outputFileName);

        const gifUrl = URL.createObjectURL(
            new Blob([data.buffer], { type: 'image/gif' })
        );

        const link = document.createElement('a');
        link.href = gifUrl;
        link.setAttribute('download', '');
        link.click();

        onConversionEnd(false);
    };

    const onCutTheVideo = async () => {
        onConversionStart(true);

        const [min, max] = sliderValues;
        console.log(videoPlayerState.duration);
        const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
        const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);
        console.log(minTime, maxTime);
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
        await ffmpeg.run(
            '-ss',
            `${minTime}`,
            '-i',
            'input.mp4',
            '-t',
            `${maxTime - minTime}`,
            '-c',
            'copy',
            'output.mp4'
        );

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const dataURL = await readFileAsBase64(
            new Blob([data.buffer], { type: 'video/mp4' })
        );

        const link = document.createElement('a');
        link.href = dataURL;
        link.setAttribute('download', '');
        link.click();

        onConversionEnd(false);
    };

    return (
        <div className="video-conversion-container">
            <Button
                onClick={() => convertToGif()}
                className="gif__out__btn"
            >
                <img
                    src={out}
                    alt="GIF 내보내기"
                />
                <p style={{ color: '#383838', fontSize: 16, fontWeight: 700 }}>
                    GIF 내보내기
                </p>
            </Button>

            <Button
                onClick={() => onCutTheVideo()}
                className="gif__out__btn"
            >
                <img
                    src={dark_download}
                    alt="비디오 저장하기"
                />
                <p style={{ color: '#383838', fontSize: 16, fontWeight: 700 }}>
                    비디오 저장하기
                </p>
            </Button>
        </div>
    );
}

export default VideoConversionButton;
