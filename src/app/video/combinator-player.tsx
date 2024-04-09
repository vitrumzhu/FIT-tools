import { Combinator } from '@webav/av-cliper';

import React, { useEffect, useState } from 'react';

export function CombinatorPlay({
  list,
  onStart,
  com,
  stream,
}: {
  list: string[];
  onStart: () => void;
  com?: Combinator | null;
  stream?: ReadableStream | null;
}) {
  const [state, setState] = useState('');
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    (async () => {
      if (com == null && stream == null) return;
      setState('合成中...');
      const timeStart = performance.now();
      const srcBlob = await new Response(com?.output() ?? stream).blob();
      setVideoSrc(URL.createObjectURL(srcBlob));
      setState(`合成耗时: ${Math.round(performance.now() - timeStart)}ms`);
    })();
  }, [com, stream]);
  return (
    <div>
      <button
        onClick={() => {
          setState('loading...');
          onStart();
        }}
        className="m-4 inline-block rounded border border-gray-100 bg-gray-100 px-12 py-3 text-sm font-medium text-black transition hover:shadow focus:outline-none focus:ring"
      >
        小飞棍～～启动！
      </button>
      {list.length > 0 && (
        <div className="m-4 ">
          素材：
          {list.map((it) => (
            <a
              href={it}
              target="_blank"
              key={it}
              style={{ marginRight: '16px', textDecoration: 'none' }}
            >
              {it}
            </a>
          ))}
        </div>
      )}
      <div className="m-4 ">
        {state}
        {videoSrc.length > 0 && (
          <a
            href={videoSrc}
            download={`WebAV-${Date.now()}.mp4`}
            target="_self"
            style={{ marginLeft: '16px', textDecoration: 'none' }}
          >
            导出视频
          </a>
        )}
      </div>
      {videoSrc.length > 0 && (
        <video
          src={videoSrc}
          controls
          autoPlay
          style={{
            width: '600px',
            height: '333px',
            display: 'block',
          }}
        ></video>
      )}
    </div>
  );
}