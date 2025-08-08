import { useEffect, useState } from "react";

interface DeviceMotionData {
    accelerationIncludingGravity: {
        x: number;
        y: number;
        z: number;
    } | null;
}

export function useDeviceMotion() {
    const [motion, setMotion] = useState<DeviceMotionData>({
        accelerationIncludingGravity: null,
    });

    useEffect(() => {
        const handleMotion = (event: DeviceMotionEvent) => {
            setMotion({
                accelerationIncludingGravity: event.accelerationIncludingGravity,
            });
        };

        if (typeof window !== "undefined" && window.DeviceMotionEvent) {
            window.addEventListener("devicemotion", handleMotion);
        }

        return () => {
            window.removeEventListener("devicemotion", handleMotion);
        };
    }, []);

    return motion;
}
