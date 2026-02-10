import { ImageResponse } from 'next/og';

// 路由段配置
export const runtime = 'edge';

// 图片元数据
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// 图片生成逻辑
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse 元素
      <div
        style={{
          fontSize: 24,
          background: '#0a0a0f', // deep dark background
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#22d3ee',      // cyan accent color
          fontFamily: 'monospace',
          fontWeight: 700,
          borderRadius: '4px', // slight rounded corners
        }}
      >
        {'>_'}
      </div>
    ),
    // ImageResponse 选项
    {
      ...size,
    }
  );
}
