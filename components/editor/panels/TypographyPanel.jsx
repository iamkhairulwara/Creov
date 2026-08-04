"use client"

import { useEffect, useState } from "react"

export default function TypographyPanel({ selectedComponent }) {

    const [fontSize, setFontSize] = useState("")

    useEffect(() => {

        if (!selectedComponent) return

        const style = selectedComponent.getStyle() || {}

        setFontSize(
            style["font-size"]
            ? style["font-size"].replace("px", "")
            : ""
        )

    }, [selectedComponent])


    const updateFontSize = (value) => {

        setFontSize(value)

        if (!selectedComponent) return


        selectedComponent.addStyle({
            "font-size": `${value}px`
        })

    }


    if (!selectedComponent) {
        return (
            <div className="text-gray-400 text-sm p-4">
                Select an element
            </div>
        )
    }


    return (

        <div className="p-4">

            <div className="
                bg-[#111827]
                border
                border-[#1f2937]
                rounded-xl
                p-4
            ">

                <h3 className="
                    text-white
                    font-semibold
                    text-sm
                    mb-4
                ">
                    Typography
                </h3>


                <label className="
                    text-gray-400
                    text-xs
                    block
                    mb-2
                ">
                    Font Size
                </label>


                <input

                    type="number"

                    value={fontSize}

                    onChange={(e)=>updateFontSize(e.target.value)}

                    className="
                        w-full
                        bg-[#0b1220]
                        border
                        border-gray-700
                        text-white
                        rounded-lg
                        px-3
                        py-2
                        outline-none
                    "

                    placeholder="16"

                />

            </div>

        </div>

    )
}