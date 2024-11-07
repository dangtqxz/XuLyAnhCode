import './App.css';
import { useState, useRef } from 'react';

function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [image6, setImage6] = useState(null);
  const [image7, setImage7] = useState(null);
  const canvasRef = useRef(null);

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const reader1 = new FileReader();
      reader1.onload = (e) => {
        setImage1(e.target.result);
      };
      reader1.readAsDataURL(files[0]); // Chọn ảnh cho khung 1
    }
  };

  const processImages = () => {
    if (!image1) return;

    const img = new Image();
    img.src = image1;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Tách biên Sobel
      const sobelData = applySobel(data, img.width, img.height);
      const sobelImageData = new ImageData(sobelData, img.width, img.height);
      ctx.putImageData(sobelImageData, 0, 0);
      setImage2(canvas.toDataURL()); // Cập nhật ảnh Sobel

      // Tách biên Prewitt
      const prewittData = applyPrewitt(data, img.width, img.height);
      const prewittImageData = new ImageData(prewittData, img.width, img.height);
      ctx.putImageData(prewittImageData, 0, 0);
      setImage3(canvas.toDataURL()); // Cập nhật ảnh Prewitt

      // Tách biên Roberts
      const robertsData = applyRoberts(data, img.width, img.height);
      const robertsImageData = new ImageData(robertsData, img.width, img.height);
      ctx.putImageData(robertsImageData, 0, 0);
      setImage4(canvas.toDataURL()); // Cập nhật ảnh Roberts

      // Tách biên Laplace
      const laplaceData = applyLaplace(data, img.width, img.height);
      const laplaceImageData = new ImageData(laplaceData, img.width, img.height);
      ctx.putImageData(laplaceImageData, 0, 0);
      setImage5(canvas.toDataURL()); // Cập nhật ảnh Laplace

      // Tách biên Zero
      const zeroData = applyZero(data, img.width, img.height);
      const zeroImageData = new ImageData(zeroData, img.width, img.height);
      ctx.putImageData(zeroImageData, 0, 0);
      setImage6(canvas.toDataURL()); // Cập nhật ảnh Zero

      // Tách biên Canny
      const cannyData = applyCanny(data, img.width, img.height);
      const cannyImageData = new ImageData(cannyData, img.width, img.height);
      ctx.putImageData(cannyImageData, 0, 0);
      setImage7(canvas.toDataURL()); // Cập nhật ảnh Canny
    };
  };

  // Hàm áp dụng bộ lọc Sobel
  const applySobel = (data, width, height) => {
    const sobelData = new Uint8ClampedArray(data.length);
    // Ma trận Sobel cho hướng X và Y
    const sobelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];
    const sobelY = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1]
    ];

    // Lặp qua từng pixel trong ảnh
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0;
        let pixelY = 0;

        // Tính toán gradient theo hướng X và Y
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const idx = ((y + i) * width + (x + j)) * 4;
            // Chuyển đổi pixel sang ảnh xám
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            pixelX += gray * sobelX[i + 1][j + 1]; // Tính gradient theo X
            pixelY += gray * sobelY[i + 1][j + 1]; // Tính gradient theo Y
          }
        }

        // Tính độ lớn của gradient
        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
        const value = magnitude > 255 ? 255 : magnitude < 0 ? 0 : magnitude;

        const idx = (y * width + x) * 4;
        // Gán giá trị cho pixel trong ảnh đầu ra
        sobelData[idx] = value; // R
        sobelData[idx + 1] = value; // G
        sobelData[idx + 2] = value; // B
        sobelData[idx + 3] = 255; // A
      }
    }
    return sobelData;
  };

  // Hàm áp dụng bộ lọc Prewitt
  const applyPrewitt = (data, width, height) => {
    const prewittData = new Uint8ClampedArray(data.length);
    // Ma trận Prewitt cho hướng X và Y
    const prewittX = [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1]
    ];
    const prewittY = [
      [1, 1, 1],
      [0, 0, 0],
      [-1, -1, -1]
    ];

    // Lặp qua từng pixel trong ảnh
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0;
        let pixelY = 0;

        // Tính toán gradient theo hướng X và Y
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const idx = ((y + i) * width + (x + j)) * 4;
            // Chuyển đổi pixel sang ảnh xám
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            pixelX += gray * prewittX[i + 1][j + 1]; // Tính gradient theo X
            pixelY += gray * prewittY[i + 1][j + 1]; // Tính gradient theo Y
          }
        }

        // Tính độ lớn của gradient
        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
        const value = magnitude > 255 ? 255 : magnitude < 0 ? 0 : magnitude;

        const idx = (y * width + x) * 4;
        // Gán giá trị cho pixel trong ảnh đầu ra
        prewittData[idx] = value; // R
        prewittData[idx + 1] = value; // G
        prewittData[idx + 2] = value; // B
        prewittData[idx + 3] = 255; // A
      }
    }
    return prewittData;
  };

  // Hàm áp dụng bộ lọc Roberts
  const applyRoberts = (data, width, height) => {
    const robertsData = new Uint8ClampedArray(data.length);
    // Ma trận Roberts cho hướng X và Y
    const robertsX = [
      [1, 0],
      [0, -1]
    ];
    const robertsY = [
      [0, 1],
      [-1, 0]
    ];

    // Lặp qua từng pixel trong ảnh
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        let pixelX = 0;
        let pixelY = 0;

        // Tính toán gradient theo hướng X và Y
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            const idx = ((y + i) * width + (x + j)) * 4;
            // Chuyển đổi pixel sang ảnh xám
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            pixelX += gray * robertsX[i][j]; // Tính gradient theo X
            pixelY += gray * robertsY[i][j]; // Tính gradient theo Y
          }
        }

        // Tính độ lớn của gradient
        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
        const value = magnitude > 255 ? 255 : magnitude < 0 ? 0 : magnitude;

        const idx = (y * width + x) * 4;
        // Gán giá trị cho pixel trong ảnh đầu ra
        robertsData[idx] = value; // R
        robertsData[idx + 1] = value; // G
        robertsData[idx + 2] = value; // B
        robertsData[idx + 3] = 255; // A
      }
    }
    return robertsData;
  };

  // Hàm áp dụng bộ lọc Laplace
  const applyLaplace = (data, width, height) => {
    const laplaceData = new Uint8ClampedArray(data.length);
    // Ma trận Laplace
    const laplaceKernel = [
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0]
    ];

    // Lặp qua từng pixel trong ảnh
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;

        // Tính toán độ sáng tổng hợp theo ma trận Laplace
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const idx = ((y + i) * width + (x + j)) * 4;
            // Chuyển đổi pixel sang ảnh xám
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            sum += gray * laplaceKernel[i + 1][j + 1]; // Tính tổng theo ma trận Laplace
          }
        }

        // Đảm bảo giá trị nằm trong khoảng 0-255
        const value = sum > 255 ? 255 : sum < 0 ? 0 : sum;

        const idx = (y * width + x) * 4;
        // Gán giá trị cho pixel trong ảnh đầu ra
        laplaceData[idx] = value; // R
        laplaceData[idx + 1] = value; // G
        laplaceData[idx + 2] = value; // B
        laplaceData[idx + 3] = 255; // A
      }
    }
    return laplaceData;
  };

  // Hàm áp dụng bộ lọc Zero
  const applyZero = (data, width, height) => {
    const zeroData = new Uint8ClampedArray(data.length);
    const gradientX = new Float32Array(data.length / 4);
    const gradientY = new Float32Array(data.length / 4);

    // Tính toán gradient bằng Sobel
    const sobelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];
    const sobelY = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1]
    ];

    // Tính toán gradient cho từng pixel
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0;
        let pixelY = 0;

        // Lặp qua ma trận Sobel để tính gradient
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const idx = ((y + i) * width + (x + j)) * 4;
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3; // Chuyển sang ảnh xám
            pixelX += gray * sobelX[i + 1][j + 1]; // Tính gradient theo X
            pixelY += gray * sobelY[i + 1][j + 1]; // Tính gradient theo Y
          }
        }

        const idx = (y * width + x) * 4;
        gradientX[y * width + x] = pixelX; // Lưu gradient theo X
        gradientY[y * width + x] = pixelY; // Lưu gradient theo Y
      }
    }

    // Phát hiện điểm giao nhau
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const gX = gradientX[y * width + x];
        const gY = gradientY[y * width + x];

        // Tính độ lớn gradient
        const magnitude = Math.sqrt(gX * gX + gY * gY);
        // Kiểm tra xem có phải là điểm giao nhau không
        const isZeroCrossing = (gX > 0 && gY < 0) || (gX < 0 && gY > 0);

        // Đặt giá trị cho pixel
        zeroData[idx] = isZeroCrossing ? 255 : 0; // R
        zeroData[idx + 1] = isZeroCrossing ? 255 : 0; // G
        zeroData[idx + 2] = isZeroCrossing ? 255 : 0; // B
        zeroData[idx + 3] = 255; // A
      }
    }
    return zeroData; // Trả về dữ liệu ảnh đã xử lý
  };

  // Hàm áp dụng bộ lọc Canny
  const applyCanny = (data, width, height) => {
    const cannyData = new Uint8ClampedArray(data.length);
    const gradientX = new Float32Array(data.length / 4);
    const gradientY = new Float32Array(data.length / 4);
    const magnitude = new Float32Array(data.length / 4);
    const direction = new Float32Array(data.length / 4);

    // Tính toán gradient bằng Sobel
    const sobelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];
    const sobelY = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1]
    ];

    // Tính toán gradient cho từng pixel
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0;
        let pixelY = 0;

        // Lặp qua ma trận Sobel để tính gradient
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const idx = ((y + i) * width + (x + j)) * 4;
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3; // Chuyển sang ảnh xám
            pixelX += gray * sobelX[i + 1][j + 1]; // Tính gradient theo X
            pixelY += gray * sobelY[i + 1][j + 1]; // Tính gradient theo Y
          }
        }

        const idx = (y * width + x) * 4;
        gradientX[y * width + x] = pixelX; // Lưu gradient theo X
        gradientY[y * width + x] = pixelY; // Lưu gradient theo Y
        magnitude[y * width + x] = Math.sqrt(pixelX * pixelX + pixelY * pixelY); // Tính độ lớn gradient
        direction[y * width + x] = Math.atan2(gradientY[y * width + x], gradientX[y * width + x]); // Tính hướng gradient
      }
    }

    // Non-maximum suppression
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const mag = magnitude[y * width + x];
        const dir = direction[y * width + x];

        // Chuyển đổi hướng về 0, 45, 90, 135 độ
        let q = 255;
        let r = 255;

        if ((dir >= -Math.PI / 8 && dir < Math.PI / 8) || (dir >= 7 * Math.PI / 8 || dir < -7 * Math.PI / 8)) {
          q = magnitude[y * width + (x + 1)];
          r = magnitude[y * width + (x - 1)];
        } else if (dir >= Math.PI / 8 && dir < 3 * Math.PI / 8) {
          q = magnitude[(y + 1) * width + (x + 1)];
          r = magnitude[(y - 1) * width + (x - 1)];
        } else if (dir >= 3 * Math.PI / 8 && dir < 5 * Math.PI / 8) {
          q = magnitude[(y + 1) * width + x];
          r = magnitude[(y - 1) * width + x];
        } else if (dir >= 5 * Math.PI / 8 && dir < 7 * Math.PI / 8) {
          q = magnitude[(y - 1) * width + (x + 1)];
          r = magnitude[(y + 1) * width + (x - 1)];
        }

        // Giữ lại pixel nếu nó là cực đại
        if (mag >= q && mag >= r) {
          cannyData[idx] = mag; // R
          cannyData[idx + 1] = mag; // G
          cannyData[idx + 2] = mag; // B
        } else {
          cannyData[idx] = 0; // R
          cannyData[idx + 1] = 0; // G
          cannyData[idx + 2] = 0; // B
        }
        cannyData[idx + 3] = 255; // A
      }
    }

    return cannyData; // Trả về dữ liệu ảnh đã xử lý
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ 
          width: '300px', 
          height: '300px', 
          border: '1px solid #000', 
          margin: '10px', 
          backgroundImage: `url(${image1})`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center' 
        }}>
          {!image1 && 'Khung Ảnh 1: ảnh gốc'}
        </div>
        <div style={{ textAlign: 'center' }}>Ảnh gốc</div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ 
          width: '300px', 
          height: '300px', 
          border: '1px solid #000', 
          margin: '10px', 
          backgroundImage: `url(${image2})`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center' 
        }}>
          {!image2 && 'Khung Ảnh 2: Sobel'}
        </div>
        <div style={{ textAlign: 'center' }}>Sobel</div>
        
        <div style={{ 
          width: '300px', 
          height: '300px', 
          border: '1px solid #000', 
          margin: '10px', 
          backgroundImage: `url(${image3})`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center' 
        }}>
          {!image3 && 'Khung Ảnh 3: Prewitt'}
        </div>
        <div style={{ textAlign: 'center' }}>Prewitt</div>
        
        <div style={{ 
          width: '300px', 
          height: '300px', 
          border: '1px solid #000', 
          margin: '10px', 
          backgroundImage: `url(${image4})`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center' 
        }}>
          {!image4 && 'Khung Ảnh 4: Roberts'}
        </div>
        <div style={{ textAlign: 'center' }}>Roberts</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ 
          width: '300px', 
          height: '300px', 
          border: '1px solid #000', 
          margin: '10px', 
          backgroundImage: `url(${image5})`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center' 
        }}>
          {!image5 && 'Khung Ảnh 5: Laplace'}
        </div>
        <div style={{ textAlign: 'center' }}>Laplace</div>
        
        <div style={{ 
          width: '300px', 
          height: '300px', 
          border: '1px solid #000', 
          margin: '10px', 
          backgroundImage: `url(${image6})`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center' 
        }}>
          {!image6 && 'Khung Ảnh 6: Zero'}
        </div>
        <div style={{ textAlign: 'center' }}>Zero</div>
        
        <div style={{ 
          width: '300px', 
          height: '300px', 
          border: '1px solid #000', 
          margin: '10px', 
          backgroundImage: `url(${image7})`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center' 
        }}>
          {!image7 && 'Khung Ảnh 7: Canny'}
        </div>
        <div style={{ textAlign: 'center' }}>Canny</div>
      </div>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={processImages}>Xử lý Ảnh</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;