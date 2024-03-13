import React, { useCallback, useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import './multiRangeSlider.css';
// export const RangeContext = React.createContext();
export default function MultiRangeSlider({ min, max, onChange, count }) {
    // console.log('new1', min, max, count);
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);
    // console.log('new', min, max, minVal, maxVal);
    // Convert to percentage
    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    useEffect(() => {
        setMinVal(0);
        setMaxVal(100);
        console.log(count);
    }, [count]);
    // Set width of the range to decrease from the left side
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent =
                // minVal;
                getPercent(minVal);
            const maxPercent =
                // +maxValRef.current.value;
                getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
        // console.log('hye');
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        // console.log(minVal, maxVal);
        if (minValRef.current) {
            const minPercent =
                // +minValRef.current.value;
                getPercent(+minValRef.current.value);
            const maxPercent =
                // maxVal;
                getPercent(maxVal);
            // console.log('first', minValRef.current, maxVal, min, max);
            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
                // console.log(
                //     'rangechange',
                //     range.current,
                //     minPercent,
                //     maxPercent,
                //     minValRef.current,
                //     maxValRef.current,
                //     minVal,
                //     maxVal
                // );
            }
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
        // console.log('dd', minVal, maxVal);
    }, [minVal, maxVal]);

    return (
        // <RangeContext.Provider value={{ minVal, maxVal }}>
        <div className="controller">
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                ref={minValRef}
                onChange={(event) => {
                    const value = Math.min(+event.target.value, maxVal - 1);
                    setMinVal(value);
                    event.target.value = value.toString();
                }}
                className={classnames('thumb thumb--zindex-3', {
                    'thumb--zindex-5': minVal > max - 100,
                })}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                ref={maxValRef}
                onChange={(event) => {
                    const value = Math.max(+event.target.value, minVal + 1);
                    setMaxVal(value);
                    event.target.value = value.toString();
                }}
                className="thumb thumb--zindex-4"
            />

            <div className="slider">
                <div className="slider__track"></div>
                <div
                    ref={range}
                    className="slider__range"
                ></div>
                {/* <div className="slider__left-value">{minVal}</div>
                <div className="slider__right-value">{maxVal}</div> */}
            </div>
            <p>
                {minVal},{maxVal}
            </p>
        </div>
        // </RangeContext.Provider>
    );
}
