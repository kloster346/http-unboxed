import { describe, it, expect } from 'vitest';
import { createScenarioState, SCENE_ORDER, SCENE_TOTAL, CAPTIONS, type SceneId } from './ScenarioState';

describe('ScenarioState', () => {
  it('初始状态正确：intro / index 0 / total 5 / 关闭播放 / 技术字幕', () => {
    const s = createScenarioState();
    expect(s.sceneId).toBe('intro');
    expect(s.index).toBe(0);
    expect(s.total).toBe(SCENE_TOTAL);
    expect(s.total).toBe(5);
    expect(s.bossMode).toBe(false);
    expect(s.playing).toBe(false);
    expect(s.caption).toBe(CAPTIONS.intro.tech);
  });

  it('advance 向前推进一幕，sceneId/index 与幕序一致', () => {
    const s = createScenarioState();
    s.advance();
    expect(s.index).toBe(1);
    expect(s.sceneId).toBe(SCENE_ORDER[1]);
    expect(s.caption).toBe(CAPTIONS[SCENE_ORDER[1]].tech);
  });

  it('advance 到最后一幕不越界（clamp）', () => {
    const s = createScenarioState();
    s.goto(SCENE_TOTAL - 1);
    s.advance();
    expect(s.index).toBe(SCENE_TOTAL - 1);
  });

  it('back 回退一幕', () => {
    const s = createScenarioState();
    s.advance();
    s.back();
    expect(s.index).toBe(0);
    expect(s.sceneId).toBe('intro');
  });

  it('back 到第一幕不越界（clamp）', () => {
    const s = createScenarioState();
    s.back();
    expect(s.index).toBe(0);
  });

  it('goto 跳转到指定幕，越界时 clamp', () => {
    const s = createScenarioState();
    s.goto(3);
    expect(s.sceneId).toBe('routes');
    s.goto(99);
    expect(s.index).toBe(SCENE_TOTAL - 1);
    s.goto(-1);
    expect(s.index).toBe(0);
  });

  it('老板模式切换后字幕立即换成比喻文案', () => {
    const s = createScenarioState();
    expect(s.caption).toBe(CAPTIONS.intro.tech);
    s.toggleBossMode();
    expect(s.bossMode).toBe(true);
    expect(s.caption).toBe(CAPTIONS.intro.meta);
    s.advance();
    expect(s.caption).toBe(CAPTIONS.assemble.meta);
  });

  it('play / pause 控制播放状态', () => {
    const s = createScenarioState();
    expect(s.playing).toBe(false);
    s.play();
    expect(s.playing).toBe(true);
    s.pause();
    expect(s.playing).toBe(false);
  });

  it('replay 回到第一幕', () => {
    const s = createScenarioState();
    s.goto(4);
    expect(s.index).toBe(4);
    s.replay();
    expect(s.index).toBe(0);
    expect(s.sceneId).toBe('intro');
  });

  it('可从自定义初始幕/老板模式/播放态创建', () => {
    const s = createScenarioState({
      sceneId: 'respond' as SceneId,
      bossMode: true,
      playing: true,
    });
    expect(s.index).toBe(SCENE_ORDER.indexOf('respond'));
    expect(s.bossMode).toBe(true);
    expect(s.playing).toBe(true);
    expect(s.caption).toBe(CAPTIONS.respond.meta);
  });
});
