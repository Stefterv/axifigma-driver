interface AccelerationProfile {
  acceleration: number;
  maximumVelocity: number;
  corneringFactor: number;
}

interface ToolingProfile {
  penDownProfile: AccelerationProfile;
  penUpProfile: AccelerationProfile;
  penDownPos: number; // int
  penUpPos: number; // int
  penLiftDuration: number;
  penDropDuration: number;
}
