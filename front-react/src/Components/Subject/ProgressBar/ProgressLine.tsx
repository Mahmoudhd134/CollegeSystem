import React from "react";
import "./progressBar.css";

interface Props {
    label: string,
    backgroundColor?: string,
    visualParts?: { percentage: string, color: string }[],
    text?: string
}

const ProgressLine = ({
                          label,
                          backgroundColor = "#e5e5e5",
                          visualParts = [{percentage: "0%", color: "white"}],
                          text = ''
                      }: Props) => {

    return (
        <>
            <div className="d-flex justify-content-between">
                <div className="progressLabel">{label}</div>
                <div>{text}</div>
            </div>
            <div
                className="progressVisualFull"
                style={{backgroundColor}}>
                {visualParts.map((item, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                width: item.percentage,
                                backgroundColor: item.color
                            }}
                            className="progressVisualPart"
                        />
                    );
                })}
            </div>
        </>
    );
};

export default ProgressLine;
