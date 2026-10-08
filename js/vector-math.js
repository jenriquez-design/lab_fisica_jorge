/**
 * VECTORES LAB - Vector Mathematics Engine
 * Provides 2D and 3D vector operations, trigonometry, and formatted string outputs.
 */

class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = Number(x);
    this.y = Number(y);
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  add(v) {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  scale(s) {
    return new Vec2(this.x * s, this.y * s);
  }

  negate() {
    return new Vec2(-this.x, -this.y);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  // 2D pseudo-cross product (Z component of 3D cross product)
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  magSq() {
    return this.x * this.x + this.y * this.y;
  }

  mag() {
    return Math.sqrt(this.magSq());
  }

  // Angle in radians (-PI to PI)
  angleRad() {
    return Math.atan2(this.y, this.x);
  }

  // Angle in degrees (0 to 360)
  angleDeg() {
    let deg = (this.angleRad() * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return deg;
  }

  // Angle between this and another vector in degrees (0 to 180)
  angleBetweenDeg(v) {
    const m1 = this.mag();
    const m2 = v.mag();
    if (m1 === 0 || m2 === 0) return 0;
    let cosTheta = this.dot(v) / (m1 * m2);
    cosTheta = Math.max(-1, Math.min(1, cosTheta));
    return (Math.acos(cosTheta) * 180) / Math.PI;
  }

  unit() {
    const m = this.mag();
    if (m === 0) return new Vec2(0, 0);
    return new Vec2(this.x / m, this.y / m);
  }

  // Projection of this onto target vector
  projectOnto(target) {
    const targetMagSq = target.magSq();
    if (targetMagSq === 0) return new Vec2(0, 0);
    const scale = this.dot(target) / targetMagSq;
    return target.scale(scale);
  }

  static fromMagAngle(mag, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return new Vec2(mag * Math.cos(rad), mag * Math.sin(rad));
  }
}

class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  add(v) {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  sub(v) {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  scale(s) {
    return new Vec3(this.x * s, this.y * s, this.z * s);
  }

  negate() {
    return new Vec3(-this.x, -this.y, -this.z);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  magSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  mag() {
    return Math.sqrt(this.magSq());
  }

  unit() {
    const m = this.mag();
    if (m === 0) return new Vec3(0, 0, 0);
    return new Vec3(this.x / m, this.y / m, this.z / m);
  }

  angleBetweenDeg(v) {
    const m1 = this.mag();
    const m2 = v.mag();
    if (m1 === 0 || m2 === 0) return 0;
    let cosTheta = this.dot(v) / (m1 * m2);
    cosTheta = Math.max(-1, Math.min(1, cosTheta));
    return (Math.acos(cosTheta) * 180) / Math.PI;
  }

  // Direction cosines (cos alpha, cos beta, cos gamma)
  directionCosines() {
    const m = this.mag();
    if (m === 0) return { alpha: 0, beta: 0, gamma: 0, degA: 0, degB: 0, degC: 0 };
    const ca = this.x / m;
    const cb = this.y / m;
    const cg = this.z / m;
    return {
      alpha: ca,
      beta: cb,
      gamma: cg,
      degA: (Math.acos(Math.max(-1, Math.min(1, ca))) * 180) / Math.PI,
      degB: (Math.acos(Math.max(-1, Math.min(1, cb))) * 180) / Math.PI,
      degC: (Math.acos(Math.max(-1, Math.min(1, cg))) * 180) / Math.PI
    };
  }
}

// Math formatting helpers
const MathFormat = {
  fixed(num, decimals = 2) {
    if (Math.abs(num) < 1e-9) return '0.00';
    return Number(num).toFixed(decimals);
  },

  round(num, decimals = 2) {
    const f = Math.pow(10, decimals);
    return Math.round(num * f) / f;
  },

  formatVec2(v, name = 'A', decimals = 2) {
    return `${name} = (${this.fixed(v.x, decimals)}, ${this.fixed(v.y, decimals)})`;
  },

  formatVec3(v, name = 'A', decimals = 2) {
    return `${name} = (${this.fixed(v.x, decimals)}, ${this.fixed(v.y, decimals)}, ${this.fixed(v.z, decimals)})`;
  },

  formatUnitVec2(v, decimals = 2) {
    const u = v.unit();
    return `û = ${this.fixed(u.x, decimals)} î + ${this.fixed(u.y, decimals)} ĵ`;
  },

  formatUnitVec3(v, decimals = 2) {
    const u = v.unit();
    return `û = ${this.fixed(u.x, decimals)} î + ${this.fixed(u.y, decimals)} ĵ + ${this.fixed(u.z, decimals)} k̂`;
  }
};

// Export globally for browser scripts
window.Vec2 = Vec2;
window.Vec3 = Vec3;
window.MathFormat = MathFormat;
