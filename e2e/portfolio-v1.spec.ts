// e2e/portfolio-v1.spec.ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const additionalCases = [
  [4, 'Easy Contract Viewer Server'],
  [5, '피에트 피트니스 트레이너'],
  [6, '피에트 피트니스'],
  [7, 'HaruCheck'],
  [8, 'Weedool'],
] as const;

test('확정안 v1 섹션 순서와 배경 톤', async ({ page }) => {
  await page.goto('/');
  const sections = page.locator('main > section');
  expect(await sections.evaluateAll((nodes) => nodes.map((node) => node.id))).toEqual([
    'top', 'career', 'case-01', 'case-02', 'case-03', 'contact',
  ]);
  expect(
    await sections.evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).backgroundColor))
  ).toEqual([
    'rgb(42, 43, 47)', 'rgb(35, 36, 39)', 'rgb(41, 45, 52)', 'rgb(49, 47, 43)', 'rgb(42, 47, 43)', 'rgb(42, 43, 47)',
  ]);
});

test('히어로 검색은 자동 입력으로 Flutter 결과를 보여 주고 멈출 수 있다', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('포트폴리오 검색');
  const results = page.getByRole('list', { name: '검색 결과' });
  await expect(input).toHaveValue('Flutter', { timeout: 5_000 });
  await expect(results.getByRole('listitem')).toHaveCount(3);
  await expect(results.getByRole('listitem').first()).toContainText('Easy Contract Viewer');

  await page.getByRole('button', { name: '자동 입력 멈추기' }).click();
  await expect(page.getByRole('button', { name: '자동 입력 다시 보기' })).toBeVisible();

  await input.fill('BLE');
  await expect(results.getByRole('listitem')).toHaveCount(1);
  await expect(results).toContainText('피에트 피트니스 트레이너');
});

test('움직임 줄이기에서는 자동 입력 없이 Flutter 결과로 고정한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByLabel('포트폴리오 검색')).toHaveValue('Flutter');
  await expect(page.getByRole('button', { name: '자동 입력 멈추기' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '자동 입력 다시 보기' })).toHaveCount(0);
  await expect(page.getByText('프로젝트 9개에서 찾기')).toBeVisible();
});

test('히어로 검색 결과 제목은 검색어와 건수를 보여 주고 목록을 설명한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const heading = page.locator('#portfolio-search-results-heading');
  await expect(heading).toHaveText('‘Flutter’ 결과 3건');
  const list = page.getByRole('list', { name: '검색 결과' });
  await expect(list).toHaveAttribute('aria-describedby', 'portfolio-search-results-heading');
  await page.getByLabel('포트폴리오 검색').fill('BLE');
  await expect(heading).toHaveText('‘BLE’ 결과 1건');
  await expect(heading).toHaveAttribute('aria-live', 'polite');
  await page.getByLabel('포트폴리오 검색').fill('');
  await expect(heading).toHaveText('추천 결과');
});

test('누른 추천 검색어만 aria-pressed=true로 선택 상태가 된다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const panel = page.locator('.search-panel');
  await panel.getByRole('button', { name: '모바일 개발', exact: true }).click();
  await expect(panel.getByRole('button', { name: '모바일 개발', exact: true })).toHaveAttribute('aria-pressed', 'true');
  for (const other of ['Flutter', 'RAG', '온디바이스', 'BLE']) {
    await expect(panel.getByRole('button', { name: other, exact: true })).toHaveAttribute('aria-pressed', 'false');
  }
  await page.getByLabel('포트폴리오 검색').fill('ble ');
  await expect(panel.getByRole('button', { name: 'BLE', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.getByRole('button', { name: '모바일 개발', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('자동 입력을 멈춘 뒤 다시 보기로 재시작하고 다시 멈출 수 있다', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('포트폴리오 검색');
  const heading = page.locator('#portfolio-search-results-heading');
  await expect(input).toHaveValue('Flutter', { timeout: 5_000 });
  await expect(heading).toHaveAttribute('aria-live', 'off');

  // Keyboard activation: the control keeps focus while its label flips (WebKit doesn't focus buttons on click).
  await page.getByRole('button', { name: '자동 입력 멈추기' }).focus();
  await page.keyboard.press('Enter');
  const replay = page.getByRole('button', { name: '자동 입력 다시 보기' });
  await expect(replay).toBeFocused();
  await expect(heading).toHaveAttribute('aria-live', 'polite');
  const stoppedValue = await input.inputValue();

  await page.keyboard.press('Enter');
  const stop = page.getByRole('button', { name: '자동 입력 멈추기' });
  await expect(stop).toBeFocused();
  await expect(heading).toHaveAttribute('aria-live', 'off');
  // Restarts from the next demo word (RAG after Flutter), typing it out again.
  await expect.poll(() => input.inputValue(), { timeout: 5_000 }).not.toBe(stoppedValue);
  await expect(input).toHaveValue('RAG', { timeout: 5_000 });

  await stop.click();
  await expect(page.getByRole('button', { name: '자동 입력 다시 보기' })).toBeVisible();
  const value = await input.inputValue();
  await page.waitForTimeout(800);
  await expect(input).toHaveValue(value);

  // Typing stops autoplay too, and the control then offers replay.
  await page.getByRole('button', { name: '자동 입력 다시 보기' }).click();
  await input.fill('BLE');
  await expect(page.getByRole('button', { name: '자동 입력 다시 보기' })).toBeVisible();
});

test('히어로 검색 화면에는 BM25·HNSW·RRF 같은 알고리즘 라벨이 없다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const panel = page.locator('.search-panel');
  await expect(page.getByLabel('포트폴리오 검색')).toHaveValue('Flutter');
  await expect(panel).not.toContainText(/BM25|HNSW|RRF/);

  for (const suggestion of ['Flutter', 'RAG', '모바일 개발', '온디바이스', 'BLE']) {
    await panel.getByRole('button', { name: suggestion, exact: true }).click();
    await expect(page.getByLabel('포트폴리오 검색')).toHaveValue(suggestion);
    await expect(panel).not.toContainText(/BM25|HNSW|RRF/);
  }
});

for (const [route, role, positioning] of [
  [
    '/',
    '크로스플랫폼 개발자 · 로컬 RAG 엔지니어',
    '모바일 제품과 로컬 검색 엔진을 설계·구현하고 평가와 운영까지 연결합니다.',
  ],
  [
    '/freelancer',
    '모바일 제품 · 문서 검색/RAG 프로젝트 수행 개발자',
    '기존 모바일 제품의 고도화부터 문서·PDF 검색 기능과 검색 백엔드까지 구현합니다.',
  ],
] as const) {
  test(`${route} 히어로가 profile.role과 positioning을 보여 준다`, async ({ page }) => {
    await page.goto(route);
    const hero = page.locator('#top');
    await expect(hero.getByText(role, { exact: true })).toBeVisible();
    await expect(hero.getByText(positioning, { exact: true })).toBeVisible();
  });
}

test('히어로 검색 키워드 힌트는 한 글자 입력에 반응하지 않고 알고리즘 이름을 보이지 않는다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const panel = page.locator('.search-panel');
  const input = page.getByLabel('포트폴리오 검색');
  await expect(input).toHaveValue('Flutter');
  for (const query of ['F', 'B', 'R', 'H', 'BM', 'RR', 'HN']) {
    await input.fill(query);
    await expect(input).toHaveValue(query);
    await expect(panel).not.toContainText(/BM25|HNSW|RRF/);
  }
  await input.fill('F');
  await expect(page.getByRole('list', { name: '검색 결과' })).not.toContainText('키워드');
});

test('사례 #1 탭은 화살표 키로 이동하고 패널을 바꾼다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const section = page.locator('#case-01');
  const tabs = section.getByRole('tab');
  await expect(tabs).toHaveCount(4);
  await tabs.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(section.getByRole('tabpanel')).toContainText('파싱부터 색인까지 기기 안에서');
  await page.keyboard.press('End');
  await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
});

test('경력 자세히는 summary와 나머지 성과를 모두 보여 준다', async ({ page }) => {
  await page.goto('/');
  const firstEntry = page.locator('#career li').first();
  await firstEntry.getByText('자세히').click();
  await expect(firstEntry).toContainText('보험 판매자용 태블릿 앱에서 약관 RAG 탐색');
  await expect(firstEntry).toContainText('PDF 조항 추출, 검색 결과 하이라이트');
});

for (const route of ['/', '/freelancer']) {
  test(`${route} 대표·추가 프로젝트가 모두 모달로 열린다`, async ({ page }) => {
    await page.goto(route);
    for (const title of ['mobile_rag_engine', 'Easy Contract Viewer', '기업 법령 검토 엔진(이음)']) {
      const button = page.getByRole('button', { name: `사례 자세히, ${title}`, exact: true });
      await expect(button).toHaveCount(1);
      await expect(button).toHaveAttribute('aria-haspopup', 'dialog');
      await button.click();
      await expect(page.getByRole('dialog')).toContainText(title);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }
    for (const [number, title] of additionalCases) {
      await page.getByRole('button', { name: new RegExp(`^프로젝트 사례 #${number},`) }).first().click();
      await expect(page.getByRole('dialog')).toContainText(title);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }
  });
}

test('사례 #4–#8은 프로젝트 사례 버튼으로 열리고 비공개 프로젝트는 나오지 않는다', async ({ page }) => {
  await page.goto('/');
  for (const [number, title] of additionalCases) {
    const button = page
      .getByRole('button', { name: new RegExp(`^프로젝트 사례 #${number}, ${title}.* 화면 보기$`) })
      .first();
    await expect(button).toHaveText(`프로젝트 사례 #${number}`);
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeVisible();
    await button.click();
    const dialog = page.getByRole('dialog', { name: new RegExp(escapeRegExp(title)) });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  }

  await expect(page.getByRole('button', { name: /^프로젝트 사례 #9/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /^프로젝트 사례 #9/ })).toHaveCount(0);
  for (const hidden of [/Motgo/, /맛집 투표/]) {
    await expect(page.getByRole('button', { name: hidden })).toHaveCount(0);
    await expect(page.getByRole('link', { name: hidden })).toHaveCount(0);
  }
  await expect(page.locator('main')).not.toContainText('Motgo');
});

test('사례 자세히 모달 상단에 카드 요약(설명·담당 범위·근거)을 보여 준다', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '사례 자세히, Easy Contract Viewer', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: /Easy Contract Viewer/ });
  const summary = dialog.locator('[data-project-card-summary]');
  await expect(summary).toBeVisible();
  await expect(summary).toContainText(
    'pdfrx, mobile_rag_engine, 로컬 SQLite/HNSW/BM25 검색, 조항 랭킹, 동의 기반 AI 요약을 연결한 Flutter 앱입니다.'
  );
  await expect(summary.getByText('담당 범위.', { exact: true })).toBeVisible();
  await expect(summary).toContainText('인제스션 단계에서 페이지 좌표를 보존해');
  await expect(summary.getByText('근거.', { exact: true })).toBeVisible();
  await expect(summary).toContainText('Flutter · pdfrx · mobile_rag_engine · PDF highlights · QA');
});

test('프로젝트 사례 #5로 연 모달도 카드 요약(담당 범위·근거)을 보여 준다', async ({ page }) => {
  await page.goto('/');
  const button = page
    .getByRole('button', { name: /^프로젝트 사례 #5, 피에트 피트니스 트레이너.* 화면 보기$/ })
    .first();
  await button.scrollIntoViewIfNeeded();
  await button.click();
  const dialog = page.getByRole('dialog', { name: /피에트 피트니스 트레이너/ });
  const summary = dialog.locator('[data-project-card-summary]');
  await expect(summary).toBeVisible();
  await expect(summary.getByText('담당 범위.', { exact: true })).toBeVisible();
  await expect(summary).toContainText('BLE 실시간 센서 연동, 트레이너용 분석 리포트');
  await expect(summary.getByText('근거.', { exact: true })).toBeVisible();
  await expect(summary).toContainText('BLE · 분석 리포트 · CI/CD');
});

test('외부 링크(이력서·GitHub·근거)는 새 탭으로 열린다', async ({ page }) => {
  await page.goto('/');
  const external = page.locator('main a[href^="http"], main a[href$=".pdf"]');
  expect(await external.count()).toBeGreaterThan(0);
  for (const link of await external.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});

test('홈과 열린 모달에 critical/serious axe 위반이 없다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const home = await new AxeBuilder({ page }).analyze();
  expect(home.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')).toEqual([]);
  await page.locator('#case-02').getByRole('button', { name: /^사례 자세히/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const modal = await new AxeBuilder({ page }).analyze();
  expect(modal.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')).toEqual([]);
});

for (const [anchor, title] of [
  ['#case-01', 'mobile_rag_engine'],
  ['#case-03', '기업 법령 검토 엔진(이음)'],
] as const) {
  test(`1024×768 ${title} 모달은 헤더가 잘리지 않고 상세 끝까지 스크롤된다`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await page.locator(anchor).getByRole('button', { name: /^사례 자세히/ }).click();
    const dialog = page.getByRole('dialog', { name: new RegExp(escapeRegExp(title)) });
    await expect(dialog).toBeVisible();

    const scroller = dialog.getByRole('region', { name: `${title} 프로젝트 상세`, exact: true });
    const header = scroller.locator('header');
    const lastDetail = scroller.locator('[data-project-info-details] section').last();

    // The header lives inside the scroll container, so it can never be clipped by a fixed row.
    expect(await header.evaluate((node) => node.closest('[data-project-info-scroll]') !== null)).toBe(true);
    const geometry = await scroller.evaluate((node) => {
      const box = node.getBoundingClientRect();
      const head = node.querySelector('header')!.getBoundingClientRect();
      return {
        overflowY: getComputedStyle(node).overflowY,
        scrollable: node.scrollHeight > node.clientHeight,
        headerTop: head.top,
        boxTop: box.top,
        boxBottom: box.bottom,
        viewport: window.innerHeight,
      };
    });
    expect(geometry.overflowY).toBe('auto');
    expect(geometry.scrollable).toBe(true);
    expect(geometry.headerTop).toBeGreaterThanOrEqual(geometry.boxTop - 1);
    expect(geometry.boxBottom).toBeLessThanOrEqual(geometry.viewport);

    await scroller.evaluate((node) => node.scrollTo({ top: node.scrollHeight }));
    await expect(lastDetail).toBeInViewport();
    // The screens column and the close button stay in place while the info column scrolls.
    await expect(dialog.getByRole('button', { name: `${title} 프로젝트 상세 닫기` })).toBeInViewport();
    expect(await header.evaluate((node) => node.getBoundingClientRect().bottom)).toBeLessThan(geometry.boxTop);
    const lastBottom = await lastDetail.evaluate((node) => node.getBoundingClientRect().bottom);
    expect(lastBottom).toBeLessThanOrEqual(geometry.boxBottom + 1);
  });
}

test('390px 사례 #1은 지표 2열 → 탭(밑줄) → 패널 → 링크 순서다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const section = page.locator('#case-01');
  const top = (locator: ReturnType<typeof section.locator>) =>
    locator.evaluate((node) => node.getBoundingClientRect().top);

  const metrics = section.locator('dl > div');
  await expect(metrics).toHaveCount(2);
  const [first, second] = await metrics.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect())
  );
  expect(Math.abs(first.top - second.top)).toBeLessThan(2);
  expect(second.left).toBeGreaterThan(first.right);

  const selected = section.getByRole('tab', { selected: true });
  const decoration = await selected.locator('.engine-tab-label').evaluate((node) => {
    const style = getComputedStyle(node);
    return { line: style.textDecorationLine, color: style.textDecorationColor };
  });
  expect(decoration.line).toContain('underline');
  expect(decoration.color).toBe('rgb(243, 224, 74)');
  await expect(selected.locator('.engine-tab-bar')).toBeHidden();
  expect(await section.locator('.engine-panel').evaluate((node) => getComputedStyle(node).rowGap)).toBe('14px');

  const metricsTop = await top(section.locator('dl'));
  const tabsTop = await top(section.getByRole('tablist'));
  const panelTop = await top(section.getByRole('tabpanel'));
  const linksTop = await top(section.getByRole('button', { name: /^사례 자세히/ }));
  expect(metricsTop).toBeLessThan(tabsTop);
  expect(tabsTop).toBeLessThan(panelTop);
  expect(panelTop).toBeLessThan(linksTop);
});

test('390px 사례 #1에서 선택된 탭 다음 Tab은 링크보다 먼저 탭 패널로 간다', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const section = page.locator('#case-01');
  const selected = section.getByRole('tab', { selected: true });
  await selected.focus();
  await expect(selected).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(section.getByRole('tabpanel')).toBeFocused();
  // WebKit skips links on Tab by default (Safari "Press Tab to highlight each item" is off).
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(section.getByRole('link').first()).toBeFocused();
});

test('사례 #1은 DOM 순서도 탭 → 패널 → 링크이고 CSS order에 기대지 않는다', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#case-01');
  const order = await section.evaluate((root) => {
    const tablist = root.querySelector('[role="tablist"]')!;
    const panel = root.querySelector('[role="tabpanel"]')!;
    const link = root.querySelector('a[href^="http"]')!;
    const follows = (a: Element, b: Element) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    const usesOrder = [...root.querySelectorAll('*')].some(
      (node) => getComputedStyle(node).order !== '0' || getComputedStyle(node).display === 'contents'
    );
    return { tabsBeforePanel: follows(tablist, panel), panelBeforeLink: follows(panel, link), usesOrder };
  });
  expect(order).toEqual({ tabsBeforePanel: true, panelBeforeLink: true, usesOrder: false });
});

test('데스크톱 사례 #1 탭은 왼쪽 막대 표시를 유지한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const selected = page.locator('#case-01').getByRole('tab', { selected: true });
  await expect(selected.locator('.engine-tab-bar')).toBeVisible();
  const line = await selected
    .locator('.engine-tab-label')
    .evaluate((node) => getComputedStyle(node).textDecorationLine);
  expect(line).toBe('none');
  const section = page.locator('#case-01');
  const rect = (locator: ReturnType<typeof section.locator>) =>
    locator.evaluate((node) => node.getBoundingClientRect().toJSON());
  const tabs = await rect(section.getByRole('tablist'));
  const panel = await rect(section.getByRole('tabpanel'));
  const link = await rect(section.getByRole('button', { name: /^사례 자세히/ }));
  expect(link.top).toBeGreaterThan(tabs.bottom);
  expect(link.left).toBeLessThan(panel.left);
  expect(panel.left).toBeGreaterThan(tabs.right);
  expect(await section.locator('.engine-panel').evaluate((node) => getComputedStyle(node).rowGap)).toBe('24px');
});

// A14 scroll format: Lenis smooth scroll, floating header, case #2 horizontal pin.
const floatingHeader = (page: import('@playwright/test').Page) => page.locator('[data-floating-header]');

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`${viewport.width}px 플로팅 헤더는 히어로를 지나면 나타나고 맨 위에서 숨는다`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const header = floatingHeader(page);
    await expect(header).toHaveAttribute('aria-hidden', 'true');
    await expect(header).toHaveAttribute('inert', '');
    await expect(page.getByRole('navigation', { name: '빠른 메뉴' })).toHaveCount(0);

    await page.evaluate(() => window.scrollTo(0, document.getElementById('career')!.offsetTop));
    await expect(header).toHaveAttribute('data-visible', 'true');
    await expect(header).not.toHaveAttribute('aria-hidden', 'true');
    await expect(header).not.toHaveAttribute('inert', '');
    const nav = page.getByRole('navigation', { name: '빠른 메뉴' });
    await expect(nav).toBeVisible();
    await expect(header).toHaveCSS('transform', 'none');
    const labels = ['작업', '경력', '연락', '이력서 PDF'];
    const targets = [header.getByRole('link', { name: /맨 위로$/ }), ...labels.map((name) => nav.getByRole('link', { name, exact: true }))];
    const boxes = [];
    for (const target of targets) {
      await expect(target).toBeVisible();
      const box = (await target.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(43.9);
      expect(box.width).toBeGreaterThanOrEqual(43.9);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
      boxes.push(box);
    }
    for (let index = 1; index < boxes.length; index += 1) {
      expect(boxes[index].x).toBeGreaterThanOrEqual(boxes[index - 1].x + boxes[index - 1].width - 0.5);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toHaveAttribute('data-visible', 'false');
    await expect(header).toHaveAttribute('aria-hidden', 'true');
    await expect(header).toBeHidden();
  });
}

test('320px 플로팅 헤더도 네 링크와 맨 위로를 겹침 없이 44px로 제공한다', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of [
    { path: '/', labels: ['작업', '경력', '연락', '이력서 PDF'] },
    { path: '/freelancer', labels: ['작업', '경력', '연락'] },
  ]) {
    await page.goto(route.path);
    await page.evaluate(() => window.scrollTo(0, document.getElementById('career')!.offsetTop));
    const nav = page.getByRole('navigation', { name: '빠른 메뉴' });
    await expect(nav).toBeVisible();
    await expect(floatingHeader(page)).toHaveCSS('transform', 'none');
    expect(await nav.getByRole('link').allTextContents()).toEqual(route.labels);
    const boxes = [
      (await floatingHeader(page).getByRole('link', { name: /맨 위로$/ }).boundingBox())!,
      ...(await Promise.all((await nav.getByRole('link').all()).map(async (link) => (await link.boundingBox())!))),
    ];
    for (const [index, box] of boxes.entries()) {
      expect(box.height).toBeGreaterThanOrEqual(43.9);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(320);
      if (index > 0) expect(box.x).toBeGreaterThanOrEqual(boxes[index - 1].x + boxes[index - 1].width - 0.5);
    }
  }
});

test('플로팅 헤더의 경력 링크는 #career 제목을 헤더에 가리지 않게 보여 준다', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.getElementById('contact')!.offsetTop));
  const nav = page.getByRole('navigation', { name: '빠른 메뉴' });
  await expect(nav).toBeVisible();
  await nav.getByRole('link', { name: '경력', exact: true }).click();
  await expect(page).toHaveURL(/#career$/);
  const heading = page.locator('#career-title');
  await expect(heading).toBeInViewport();
  await expect
    .poll(() => page.locator('#career').evaluate((node) => Math.abs(node.getBoundingClientRect().top)))
    .toBeLessThanOrEqual(1);
  const headerBottom = await floatingHeader(page).locator('> div').evaluate((node) => node.getBoundingClientRect().bottom);
  const headingTop = await heading.evaluate((node) => node.getBoundingClientRect().top);
  expect(headingTop).toBeGreaterThan(headerBottom);
});

test('1440px 사례 #2는 고정된 채 스크롤 단계마다 큰 화면을 하나씩 보여주고 다음 섹션으로 이어진다', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  const section = page.locator('#case-02');
  await expect(section).toHaveAttribute('data-pin', 'on');
  await expect(section).toHaveAttribute('data-snap-steps', '3');
  // Pinned, the steps list does not scroll, so it is not a Tab stop.
  await expect(section.locator('ol')).not.toHaveAttribute('tabindex', /.*/);

  const trackTop = await section.evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
  const scrollable = await section.evaluate((node) => node.getBoundingClientRect().height - window.innerHeight);
  // Exactly one viewport per step: start, +1 step, +2 steps.
  expect(Math.abs(scrollable - 2 * 900)).toBeLessThanOrEqual(1);
  const shots = section.locator('.pin-row > li');
  const indicator = section.locator('.pin-progress p');

  for (const [offset, expected] of [
    [0, 0], [300, 0], [500, 1], [900, 1], [1300, 1], [1400, 2], [1800, 2], [1000, 1], [100, 0],
  ] as const) {
    await page.evaluate((y) => window.scrollTo(0, y), trackTop + offset);
    await expect(indicator).toContainText(`${expected + 1} / 3`);
    for (let index = 0; index < 3; index += 1) {
      await expect(shots.nth(index)).toHaveAttribute(
        'data-step-state',
        index < expected ? 'before' : index > expected ? 'after' : 'current'
      );
    }
    await expect(shots.nth(expected)).toBeVisible();
    await expect(shots.nth(expected).locator('img')).toBeInViewport({ ratio: 1 });
    // Only one screen is shown at a time.
    for (let index = 0; index < 3; index += 1) {
      if (index !== expected) await expect(shots.nth(index)).toBeHidden();
    }
    const state = await section.evaluate((node) => {
      const stage = node.querySelector('.pin-stage')!.getBoundingClientRect();
      const tops = [...node.querySelectorAll('.pin-row > li')].map((li) => li.getBoundingClientRect().top);
      return { stageTop: stage.top, tops };
    });
    expect(Math.abs(state.stageTop)).toBeLessThan(1);
    // Not staggered: every screen sits on the same line.
    expect(Math.max(...state.tops) - Math.min(...state.tops)).toBeLessThan(1);
    // The text column (with its links) stays in the stage the whole time.
    await expect(section.getByRole('button', { name: /^사례 자세히/ })).toBeInViewport();
  }

  // Large, fully visible phone screen with the 1344×2992 ratio.
  const size = await shots.nth(0).locator('img').evaluate((img) => {
    const rect = img.getBoundingClientRect();
    return { width: rect.width, height: rect.height, top: rect.top, bottom: rect.bottom };
  });
  expect(size.height).toBeGreaterThan(600);
  expect(Math.abs(size.width / size.height - 1344 / 2992)).toBeLessThan(0.01);
  expect(size.top).toBeGreaterThanOrEqual(70);
  expect(size.bottom).toBeLessThanOrEqual(900);

  await page.evaluate((y) => window.scrollTo(0, y), trackTop + scrollable + 300);
  await expect(page.locator('#case-03')).toBeInViewport();
  expect(await page.locator('#case-03').evaluate((node) => node.getBoundingClientRect().top)).toBeLessThan(900);
});

test('#case-02 앵커는 트랙의 시작에 도착한다', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('#case-01').scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const link = document.createElement('a');
    link.href = '#case-02';
    link.textContent = 'test link';
    link.id = 'case-02-test-link';
    document.querySelector('#case-01')!.append(link);
  });
  await page.locator('#case-02-test-link').click();
  await expect(page).toHaveURL(/#case-02$/);
  await expect
    .poll(() => page.locator('#case-02').evaluate((node) => Math.abs(node.getBoundingClientRect().top)))
    .toBeLessThanOrEqual(1);
  await expect
    .poll(async () => Number(await page.locator('#case-02').getAttribute('data-pin-progress')))
    .toBeLessThan(0.01);
  await expect(page.locator('#case-02 .pin-row > li').first()).toHaveAttribute('data-step-state', 'current');
  await expect(page.locator('#case-02 .pin-progress p')).toContainText('1 / 3');
  // Progress numbers are screen-reader only (no visible progress numbering per the design rules).
  await expect(page.locator('#case-02 .pin-progress p')).toHaveClass(/\bsr-only\b/);
});

test('390px 사례 #2는 고정하지 않고 한 화면씩(약 78vw) 넘기는 가로 스냅 캐러셀이다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const section = page.locator('#case-02');
  await section.scrollIntoViewIfNeeded();
  await expect(section).not.toHaveAttribute('data-pin', /.+/);
  await expect(section).not.toHaveAttribute('data-snap-steps', /.+/);
  // The mobile carousel scrolls horizontally, so it stays keyboard-focusable.
  await expect(section.locator('ol')).toHaveAttribute('tabindex', '0');
  await expect(section.locator('.pin-progress')).toBeHidden();
  const state = await section.evaluate((node) => {
    const list = node.querySelector('ol')!;
    const items = [...list.querySelectorAll('li')].map((li) => li.getBoundingClientRect());
    const listRect = list.getBoundingClientRect();
    return {
      stage: getComputedStyle(node.querySelector('.pin-stage')!).position,
      overflowX: getComputedStyle(list).overflowX,
      snap: getComputedStyle(list).scrollSnapType,
      transform: list.style.transform,
      widths: items.map((rect) => rect.width),
      tops: items.map((rect) => rect.top),
      firstRight: items[0].right,
      secondLeft: items[1].left,
      listRight: listRect.right,
    };
  });
  expect(state.stage).not.toBe('sticky');
  expect(state.overflowX).toBe('auto');
  expect(state.snap).toContain('x');
  expect(state.snap).toContain('mandatory');
  expect(state.transform).toBe('');
  for (const width of state.widths) expect(Math.abs(width - 390 * 0.78)).toBeLessThanOrEqual(2);
  // Aligned (no offsets); the first screen fills the view and the next one peeks in.
  expect(Math.max(...state.tops) - Math.min(...state.tops)).toBeLessThan(1);
  expect(state.firstRight).toBeLessThanOrEqual(state.listRight);
  expect(state.secondLeft).toBeLessThan(state.listRight);
  expect(state.listRight - state.secondLeft).toBeGreaterThan(8);
});

test('움직임 줄이기에서는 Lenis와 사례 #2 고정이 꺼진다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  // Record whether <html> ever receives the 'lenis' class, from the first paint on.
  await page.addInitScript(() => {
    const flags = window as unknown as { __lenisSeen?: boolean };
    flags.__lenisSeen = false;
    const record = () => {
      if (document.documentElement?.classList.contains('lenis')) flags.__lenisSeen = true;
    };
    new MutationObserver(record).observe(document, { attributes: true, attributeFilter: ['class'], subtree: true });
  });
  await page.goto('/');
  const section = page.locator('#case-02');
  await section.scrollIntoViewIfNeeded();
  expect(await section.evaluate((node) => getComputedStyle(node.querySelector('.pin-stage')!).position)).not.toBe('sticky');
  expect(await section.evaluate((node) => (node.querySelector('.pin-row') as HTMLElement).style.transform)).toBe('');
  await expect(section).not.toHaveAttribute('data-pin-progress', /.+/);
  await expect(section).not.toHaveAttribute('data-snap-steps', /.+/);
  // All three screens show in one aligned row.
  for (let index = 0; index < 3; index += 1) await expect(section.locator('.pin-row > li').nth(index)).toBeVisible();
  const tops = await section.evaluate((node) =>
    [...node.querySelectorAll('.pin-row > li')].map((li) => li.getBoundingClientRect().top)
  );
  expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1);

  // Native anchors still work without Lenis.
  await page.evaluate(() => window.scrollTo(0, document.getElementById('contact')!.offsetTop));
  await page.getByRole('navigation', { name: '빠른 메뉴' }).getByRole('link', { name: '경력', exact: true }).click();
  await expect(page).toHaveURL(/#career$/);
  await expect(page.locator('#career-title')).toBeInViewport();
  expect(await page.evaluate(() => (window as unknown as { __lenisSeen?: boolean }).__lenisSeen)).toBe(false);
  await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
});

test('모달이 열리면 Lenis가 멈추고 모달 안 스크롤은 그대로 동작한다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  await page.getByRole('button', { name: '사례 자세히, Easy Contract Viewer', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: /Easy Contract Viewer/ });
  await expect(dialog).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/\blenis-stopped\b/);
  const scrollYBefore = await page.evaluate(() => window.scrollY);
  const region = dialog.getByRole('region', { name: 'Easy Contract Viewer 프로젝트 상세', exact: true });
  const box = (await region.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => region.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollYBefore);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/\blenis-stopped\b/);
});

for (const [label, hrefPattern] of [
  ['경력', '#career'],
  ['맨 위로', '#top'],
] as const) {
  test(`플로팅 헤더가 숨을 때 '${label}' 포커스는 히어로 내비게이션의 같은 링크로 넘어간다`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.getElementById('career')!.offsetTop));
    const header = floatingHeader(page);
    await expect(header).toHaveAttribute('data-visible', 'true');
    const floatingLink =
      label === '맨 위로'
        ? header.getByRole('link', { name: /맨 위로$/ })
        : page.getByRole('navigation', { name: '빠른 메뉴' }).getByRole('link', { name: label, exact: true });
    await floatingLink.focus();
    await expect(floatingLink).toBeFocused();

    await page.keyboard.press('Home');
    await expect(header).toHaveAttribute('data-visible', 'false');
    const heroLink = page.locator('#hero-header').locator(`a[href="${hrefPattern}"]`).first();
    await expect(heroLink).toBeFocused();
    expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY');
  });
}

// A15 section snapping (desktop wheel, on top of Lenis).
type Page = import('@playwright/test').Page;

/** Resolves once window.scrollY has not changed for 600ms (longer than the snap debounce). */
const settledScrollY = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let last = window.scrollY;
        let since = performance.now();
        const tick = (now: number) => {
          if (Math.abs(window.scrollY - last) > 0.5) {
            last = window.scrollY;
            since = now;
          }
          if (now - since >= 600) resolve(window.scrollY);
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      })
  );

const sectionTop = (page: Page, id: string) =>
  page.locator(`#${id}`).evaluate((node) => Math.round(node.getBoundingClientRect().top + window.scrollY));

/** Distance (px) of a section's top from the viewport top. */
const viewportTopOf = (page: Page, id: string) =>
  page.locator(`#${id}`).evaluate((node) => Math.abs(node.getBoundingClientRect().top));

async function openAt(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(viewport.width / 2, viewport.height / 2);
}

test.describe('1440px 섹션 스냅', () => {
  test.beforeEach(async ({ page }) => {
    await openAt(page, { width: 1440, height: 900 });
    await expect(page.locator('html')).toHaveClass(/\blenis\b/);
    await expect(page.locator('#case-02')).toHaveAttribute('data-pin', 'on');
  });

  test('맨 위에서 휠 한 칸이면 #career 시작에 멈춘다', async ({ page }) => {
    await page.mouse.wheel(0, 120);
    await expect.poll(() => viewportTopOf(page, 'career')).toBeLessThanOrEqual(2);
    const careerTop = await sectionTop(page, 'career');
    expect(Math.abs((await settledScrollY(page)) - careerTop)).toBeLessThanOrEqual(2);
  });

  test('트랙패드처럼 작은 휠 30번(40px)은 지나간 거리 다음의 경계에 정확히 멈춘다', async ({ page }) => {
    for (let step = 0; step < 30; step += 1) await page.mouse.wheel(0, 40);
    // 1200px down from the top: past the career end-aligned point, so the next boundary is case #1's start.
    const careerEnd = await page.locator('#career').evaluate(
      (node) => node.getBoundingClientRect().top + window.scrollY + node.getBoundingClientRect().height - window.innerHeight
    );
    const case01Top = await sectionTop(page, 'case-01');
    expect(careerEnd).toBeLessThan(1200);
    expect(case01Top).toBeGreaterThan(1200);
    expect(Math.abs((await settledScrollY(page)) - case01Top)).toBeLessThanOrEqual(2);
  });

  test('아래로 세 칸 굴리다 위로 한 칸이면 마지막 방향(위)의 경계로 돌아간다', async ({ page }) => {
    const case01Top = await sectionTop(page, 'case-01');
    await page.evaluate((y) => window.scrollTo(0, y), case01Top);
    await settledScrollY(page);
    for (let step = 0; step < 3; step += 1) await page.mouse.wheel(0, 120);
    await page.mouse.wheel(0, -120);
    // Net displacement is +240 (toward case #2), but the last input was up.
    expect(Math.abs((await settledScrollY(page)) - case01Top)).toBeLessThanOrEqual(2);
  });

  test('ArrowDown 키 스크롤은 스냅하지 않는다', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Playwright WebKit does not scroll the page with ArrowDown from <body>.');
    await page.locator('body').focus();
    for (let step = 0; step < 3; step += 1) await page.keyboard.press('ArrowDown');
    const position = await settledScrollY(page);
    expect(position).toBeGreaterThan(20);
    expect(position).toBeLessThan((await sectionTop(page, 'career')) - 100);
  });

  test('모달이 열려 있으면 휠로 스냅하지 않는다', async ({ page }) => {
    const case01Top = await sectionTop(page, 'case-01');
    await page.evaluate((y) => window.scrollTo(0, y), case01Top + 300);
    await settledScrollY(page);
    await page.locator('#case-02').getByRole('button', { name: /^사례 자세히/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('html')).toHaveClass(/\blenis-stopped\b/);
    const before = await settledScrollY(page);
    await page.mouse.move(720, 450);
    for (let step = 0; step < 3; step += 1) await page.mouse.wheel(0, 120);
    expect(await settledScrollY(page)).toBe(before);
  });

  test('#career 중간에서 아래로 끝을 넘기면 #case-01 시작에 멈춘다', async ({ page }) => {
    const careerTop = await sectionTop(page, 'career');
    await page.evaluate((y) => window.scrollTo(0, y), careerTop + 100);
    await settledScrollY(page);
    const careerHeight = await page.locator('#career').evaluate((node) => node.getBoundingClientRect().height);
    await page.mouse.wheel(0, Math.max(240, careerHeight - 900 + 60));
    await expect.poll(() => viewportTopOf(page, 'case-01')).toBeLessThanOrEqual(2);
    await settledScrollY(page);
    expect(await viewportTopOf(page, 'case-01')).toBeLessThanOrEqual(2);
  });

  test('긴 섹션 안의 작은 휠은 섹션 시작으로 되돌아가지 않는다', async ({ page }) => {
    // Career: a small step forward never settles back on its start.
    const careerTop = await sectionTop(page, 'career');
    await page.evaluate((y) => window.scrollTo(0, y), careerTop);
    await settledScrollY(page);
    await page.mouse.wheel(0, 40);
    expect(await settledScrollY(page)).toBeGreaterThanOrEqual(careerTop + 38);
  });

  test('사례 #2는 휠 한 칸마다 화면 하나씩 넘기고, 세 번째 다음은 #case-03, 위로 한 칸이면 세 번째 화면이다', async ({ page }) => {
    const track = page.locator('#case-02');
    const shots = track.locator('.pin-row > li');
    const indicator = track.locator('.pin-progress p');
    const trackTop = await sectionTop(page, 'case-02');
    await page.evaluate((y) => window.scrollTo(0, y), trackTop);
    await settledScrollY(page);
    await expect(indicator).toContainText('1 / 3');
    await expect(shots.nth(0)).toBeVisible();

    await page.mouse.wheel(0, 120);
    expect(Math.abs((await settledScrollY(page)) - (trackTop + 900))).toBeLessThanOrEqual(2);
    await expect(indicator).toContainText('2 / 3');
    await expect(shots.nth(1)).toBeVisible();
    await expect(shots.nth(1).locator('img')).toBeInViewport({ ratio: 1 });
    await expect(shots.nth(0)).toBeHidden();
    await expect(shots.nth(0).locator('img')).not.toBeInViewport();

    await page.mouse.wheel(0, 120);
    expect(Math.abs((await settledScrollY(page)) - (trackTop + 1800))).toBeLessThanOrEqual(2);
    await expect(indicator).toContainText('3 / 3');
    await expect(shots.nth(2)).toBeVisible();
    await expect(shots.nth(1)).toBeHidden();

    await page.mouse.wheel(0, 120);
    await expect.poll(() => viewportTopOf(page, 'case-03')).toBeLessThanOrEqual(2);
    await settledScrollY(page);
    expect(await viewportTopOf(page, 'case-03')).toBeLessThanOrEqual(2);

    await page.mouse.wheel(0, -120);
    expect(Math.abs((await settledScrollY(page)) - (trackTop + 1800))).toBeLessThanOrEqual(2);
    await expect(indicator).toContainText('3 / 3');
    await expect(shots.nth(2)).toBeVisible();

    await page.mouse.wheel(0, -120);
    expect(Math.abs((await settledScrollY(page)) - (trackTop + 900))).toBeLessThanOrEqual(2);
    await expect(indicator).toContainText('2 / 3');
  });

  test('사례 #2에서 PageDown은 화면 하나씩, 세 번째 다음은 #case-03으로 간다', async ({ page }) => {
    const indicator = page.locator('#case-02 .pin-progress p');
    const trackTop = await sectionTop(page, 'case-02');
    await page.evaluate((y) => window.scrollTo(0, y), trackTop);
    await settledScrollY(page);
    await page.locator('body').focus();
    await page.keyboard.press('PageDown');
    expect(Math.abs((await settledScrollY(page)) - (trackTop + 900))).toBeLessThanOrEqual(2);
    await expect(indicator).toContainText('2 / 3');
    await page.keyboard.press('PageDown');
    expect(Math.abs((await settledScrollY(page)) - (trackTop + 1800))).toBeLessThanOrEqual(2);
    await expect(indicator).toContainText('3 / 3');
    await page.keyboard.press('PageDown');
    await expect.poll(() => viewportTopOf(page, 'case-03')).toBeLessThanOrEqual(2);
    await page.keyboard.press('PageUp');
    expect(Math.abs((await settledScrollY(page)) - (trackTop + 1800))).toBeLessThanOrEqual(2);
  });

  test('PageDown은 다음 섹션 경계로 간다', async ({ page }) => {
    await page.locator('body').focus();
    await page.keyboard.press('PageDown');
    await expect.poll(() => viewportTopOf(page, 'career')).toBeLessThanOrEqual(2);
    // Career is taller than the viewport: its end, then case #1.
    await page.keyboard.press('PageDown');
    await expect.poll(() => page.locator('#career').evaluate((node) => Math.abs(node.getBoundingClientRect().bottom - 900))).toBeLessThanOrEqual(2);
    await page.keyboard.press('PageDown');
    await expect.poll(() => viewportTopOf(page, 'case-01')).toBeLessThanOrEqual(2);
  });

  test("플로팅 헤더 '연락' 앵커는 스냅과 상관없이 #contact에 도착한다", async ({ page }) => {
    await page.mouse.wheel(0, 120);
    await expect.poll(() => viewportTopOf(page, 'career')).toBeLessThanOrEqual(2);
    await page.getByRole('navigation', { name: '빠른 메뉴' }).getByRole('link', { name: '연락', exact: true }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect.poll(() => viewportTopOf(page, 'contact')).toBeLessThanOrEqual(2);
    await settledScrollY(page);
    expect(await viewportTopOf(page, 'contact')).toBeLessThanOrEqual(2);
  });
});

test('히어로 높이는 검색 자동 입력 결과에 따라 바뀌지 않는다', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1440, height: 700 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
  ]) {
    await openAt(page, viewport);
    const input = page.getByLabel('포트폴리오 검색');
    const heights = new Set<number>();
    for (const word of ['Flutter', 'RAG', '모바일 개발', '온디바이스']) {
      await input.fill(word);
      await expect(page.getByRole('list', { name: '검색 결과' }).getByRole('listitem').first()).toBeVisible();
      heights.add(await page.locator('#top').evaluate((node) => Math.round(node.getBoundingClientRect().height)));
    }
    expect([...heights], `${viewport.width}×${viewport.height}`).toHaveLength(1);
  }
});

test('히어로 높이는 자동 입력이 데모 단어를 도는 동안 바뀌지 않는다', async ({ page }) => {
  test.setTimeout(90_000);
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
  ]) {
    await openAt(page, viewport);
    // Autoplay pauses while the panel is out of view; at 1024 the panel sits below the intro.
    await page.locator('.search-panel').evaluate((node) => node.scrollIntoView({ block: 'center' }));
    // Poll the hero height every animation frame while autoplay types every demo word once.
    const result = await page.evaluate(
      (words) =>
        new Promise<{ heights: number[]; seen: string[] }>((resolve) => {
          const input = document.querySelector<HTMLInputElement>('#portfolio-search-input')!;
          const hero = document.querySelector<HTMLElement>('#top')!;
          const heights = new Set<number>();
          const seen = new Set<string>();
          const started = performance.now();
          const tick = () => {
            heights.add(Math.round(hero.getBoundingClientRect().height * 100) / 100);
            if (words.includes(input.value)) seen.add(input.value);
            if (seen.size === words.length || performance.now() - started > 40_000) {
              resolve({ heights: [...heights], seen: [...seen] });
            } else requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
      ['Flutter', 'RAG', '모바일 개발', '온디바이스']
    );
    expect(result.seen, `${viewport.width}×${viewport.height}`).toHaveLength(4);
    expect(result.heights, `${viewport.width}×${viewport.height}`).toHaveLength(1);
  }
});

test('390px에서는 스냅하지 않고 휠이 남긴 위치에 머문다', async ({ page }) => {
  await openAt(page, { width: 390, height: 844 });
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  await page.mouse.wheel(0, 120);
  expect(Math.abs((await settledScrollY(page)) - 120)).toBeLessThanOrEqual(2);
});

test('움직임 줄이기에서는 스냅하지 않는다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openAt(page, { width: 1440, height: 900 });
  await page.mouse.wheel(0, 120);
  const position = await settledScrollY(page);
  expect(position).toBeGreaterThan(60);
  expect(position).toBeLessThan(300);
  await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
});

// A18 — modal media area, screen list and presentation cleanup.
const openIeumModal = async (page: import('@playwright/test').Page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: '사례 자세히, 기업 법령 검토 엔진(이음)', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: /기업 법령 검토 엔진\(이음\)/ });
  await expect(dialog).toBeVisible();
  return dialog;
};

// No public api project ships a long-page screenshot any more, so the modal's tall-image
// behavior (fit is decided from the image's intrinsic ratio) is exercised by serving a
// retained long capture (h/w ≈ 2.9) in place of the Ieum '시스템 구성' diagram.
const TALL_FIXTURE = 'public/images/law-info-engine/search-ui-full.png';
const serveTallImageForArchitecture = (page: import('@playwright/test').Page) =>
  page.route(/\/images\/law-info-engine\/ieum\/system\.svg/, (route) =>
    route.fulfill({ path: `${process.cwd()}/${TALL_FIXTURE}`, contentType: 'image/png' })
  );

test('1440 이음 모달: 16:10 화면은 패널 폭을 채우고 스크롤되지 않으며 프레임 라벨은 현재 화면 제목이다', async ({ page }) => {
  const dialog = await openIeumModal(page);
  const label = dialog.locator('[data-screen-frame-label]');
  // Opens on the report + citation screen (thumbnailScreenIndex) and labels it.
  await expect(label).toHaveText('검토 보고서와 근거 원문');
  await expect(dialog).not.toContainText('백엔드 아키텍처');

  const frame = dialog.locator('[data-screen-frame]');
  await expect(frame).toHaveAttribute('data-fit', 'contain');
  await expect(dialog.locator('[data-scroll-viewport]')).toHaveCount(0);
  const media = dialog.locator('[data-modal-media] img');
  await expect(media).toHaveAttribute(
    'alt',
    '감사인의 대투자자 손해배상책임 검토 보고서와 오른쪽 근거 원문 패널의 외부감사법 제31조'
  );
  const widths = await dialog.evaluate((node) => ({
    panel: node.querySelector('[data-modal-media]')!.getBoundingClientRect().width,
    frame: node.querySelector('[data-screen-frame]')!.getBoundingClientRect().width,
  }));
  expect(widths.frame).toBeGreaterThanOrEqual(widths.panel * 0.9);

  // The frame is a 1px line frame; the marker ring appears only on keyboard focus.
  const border = await frame.evaluate((node) => getComputedStyle(node).borderTopWidth);
  expect(border).toBe('1px');

  // The presentation shows the same 16:10 capture whole, without a scroll region.
  await dialog.getByRole('button', { name: '기업 법령 검토 엔진(이음) 프레젠테이션 열기' }).click();
  const presentation = page.getByRole('dialog', { name: '검토 보고서와 근거 원문' });
  await expect(presentation).toBeVisible();
  await expect(presentation.getByRole('region', { name: /스크린샷 스크롤 영역$/ })).toHaveCount(0);
  await expect(presentation.locator('[data-scroll-hint]')).toHaveCount(0);
});

test('1440 이음 모달: 긴 화면은 패널 폭으로 스크롤된다', async ({ page }) => {
  await serveTallImageForArchitecture(page);
  const dialog = await openIeumModal(page);
  const list = dialog.getByRole('list', { name: '기업 법령 검토 엔진(이음) 화면 목록' });
  const label = dialog.locator('[data-screen-frame-label]');

  await list.getByRole('button', { name: '시스템 구성' }).click();
  await expect(label).toHaveText('시스템 구성');
  const frame = dialog.locator('[data-screen-frame]');
  await expect(frame).toHaveAttribute('data-fit', 'scroll');
  const region = dialog.getByRole('region', { name: '시스템 구성 화면, 스크롤 가능', exact: true });
  await expect(region).toBeVisible();
  await expect(region).toHaveAttribute('data-lenis-prevent');
  const widths = await dialog.evaluate((node) => ({
    panel: node.querySelector('[data-modal-media]')!.getBoundingClientRect().width,
    image: node.querySelector('[data-scroll-viewport] img')!.getBoundingClientRect().width,
  }));
  expect(widths.image).toBeGreaterThanOrEqual(widths.panel * 0.8);
  await expect
    .poll(() => region.evaluate((node) => node.scrollHeight > node.clientHeight * 2))
    .toBe(true);
  const hint = dialog.locator('[data-scroll-hint]');
  await expect(hint).toBeVisible();
  await expect(hint).toContainText('아래로 더 있음');
  await region.focus();
  await page.keyboard.press('PageDown');
  await expect.poll(() => region.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await region.evaluate((node) => node.scrollTo({ top: node.scrollHeight }));
  await expect(hint).toBeHidden();
});

test('모달 화면 목록이 미디어 이미지를 바꾸고 aria-current를 옮긴다', async ({ page }) => {
  const dialog = await openIeumModal(page);
  const list = dialog.getByRole('list', { name: '기업 법령 검토 엔진(이음) 화면 목록' });
  const items = list.getByRole('button');
  await expect(items).toHaveCount(7);
  const current = list.locator('[aria-current="true"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText('검토 보고서와 근거 원문');

  const media = dialog.locator('[data-modal-media] img');
  await expect(media).toHaveAttribute(
    'alt',
    '감사인의 대투자자 손해배상책임 검토 보고서와 오른쪽 근거 원문 패널의 외부감사법 제31조'
  );
  const target = list.getByRole('button', { name: '사안 입력' });
  await target.click();
  await expect(target).toHaveAttribute('aria-current', 'true');
  await expect(current).toHaveCount(1);
  // Switching never moves focus away from the list (WebKit does not focus buttons on click).
  await target.focus();
  await page.keyboard.press('Enter');
  await expect(target).toBeFocused();
  await expect(media).toHaveAttribute(
    'alt',
    "이음 첫 화면. '어떤 사안을 검토할까요?' 입력란과 최근 검토 문서 목록"
  );
  await expect(dialog.locator('[aria-live="polite"]')).toHaveText('사안 입력 화면 표시 중');

  // Keyboard: Enter on another item switches as well; the presentation opens on that screen.
  await list.getByRole('button', { name: '보고서 생성·검증 경로' }).focus();
  await page.keyboard.press('Enter');
  await expect(list.getByRole('button', { name: '보고서 생성·검증 경로' })).toHaveAttribute('aria-current', 'true');
  await dialog.getByRole('button', { name: '기업 법령 검토 엔진(이음) 프레젠테이션 열기' }).click();
  await expect(page.getByRole('heading', { name: '보고서 생성·검증 경로', level: 2 })).toBeVisible();
});

test('프레젠테이션: 보이는 진행 번호 없이 sr-only 상태를 제공하고 16:10 구성도는 스크롤 없이 전체를 보여 준다', async ({ page }) => {
  const dialog = await openIeumModal(page);
  await dialog
    .getByRole('list', { name: '기업 법령 검토 엔진(이음) 화면 목록' })
    .getByRole('button', { name: '보고서 생성·검증 경로' })
    .click();
  await dialog.getByRole('button', { name: '기업 법령 검토 엔진(이음) 프레젠테이션 열기' }).click();

  const presentation = page.getByRole('dialog', { name: '보고서 생성·검증 경로' });
  await expect(presentation).toBeVisible();
  const status = presentation.locator('[aria-live="polite"]');
  await expect(status).toHaveText('화면 6 / 7, 보고서 생성·검증 경로');
  await expect(status).toHaveClass(/\bsr-only\b/);
  // No visible 'NN / NN' progress text anywhere in the overlay.
  const visibleText = await presentation.evaluate((node) => {
    const clone = node.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.sr-only').forEach((el) => el.remove());
    return clone.textContent ?? '';
  });
  expect(visibleText).not.toMatch(/\b\d{1,2}\s*\/\s*\d{1,2}\b/);
  await expect(presentation.locator('[data-presentation-progress] > span')).toHaveCount(7);

  // The 16:10 diagram is contained whole: no scroll region, no scroll hint.
  const diagram = presentation.locator('img[src*="/images/law-info-engine/ieum/report-flow.svg"]');
  await expect(diagram).toBeVisible();
  await expect(presentation.getByRole('region', { name: /스크린샷 스크롤 영역$/ })).toHaveCount(0);
  await expect(presentation.locator('[data-scroll-hint]')).toHaveCount(0);

  // The compact bottom bar leaves most of the height to the image stage.
  const heights = await presentation.evaluate((node) => ({
    stage: node.querySelector('[data-presentation-stage]')!.getBoundingClientRect().height,
    bar: node.querySelector('[data-presentation-bar]')!.getBoundingClientRect().height,
  }));
  expect(heights.bar).toBeLessThanOrEqual(90);
  expect(heights.stage).toBeGreaterThanOrEqual(900 * 0.7);
  for (const name of ['이전 화면', '다음 화면', '프레젠테이션 닫기', '보고서 생성·검증 경로 원본 이미지 새 창에서 열기']) {
    const box = (await presentation.getByRole(name.includes('원본') ? 'link' : 'button', { name }).boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
  }
});

test('프레젠테이션: 긴 화면은 스크롤 영역과 스크롤 힌트를 제공한다', async ({ page }) => {
  // The Ieum diagrams are 16:10 now; the long-screen path is exercised on a screen the data
  // flags `scrollable` (피에트 피트니스 트레이너 '결과 리포트 - 인바디').
  await page.goto('/');
  await page.getByRole('button', { name: /^프로젝트 사례 #5,/ }).first().click();
  const dialog = page.getByRole('dialog', { name: /피에트 피트니스 트레이너/ });
  await dialog
    .getByRole('button', { name: '피에트 피트니스 트레이너 결과 리포트 - 인바디 프레젠테이션 열기' })
    .click();

  const presentation = page.getByRole('dialog', { name: '결과 리포트 - 인바디' });
  await expect(presentation).toBeVisible();
  const region = presentation.getByRole('region', { name: '결과 리포트 - 인바디 스크린샷 스크롤 영역' });
  await expect(region).toHaveAttribute('data-lenis-prevent');
  await expect
    .poll(() => region.evaluate((node) => node.scrollHeight > node.clientHeight))
    .toBe(true);
  const hint = presentation.locator('[data-scroll-hint]');
  await expect(hint).toBeVisible();
  await region.evaluate((node) => node.scrollTo({ top: node.scrollHeight }));
  await expect(hint).toBeHidden();
});

test('폰 사례(Easy Contract Viewer) 모달은 디바이스 프레임을 유지한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: '사례 자세히, Easy Contract Viewer', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: /Easy Contract Viewer/ });
  await expect(dialog).toBeVisible();
  const device = dialog.locator('[data-device-frame="mobile"]');
  await expect(device).toBeVisible();
  await expect(device).toHaveAccessibleName('Easy Contract Viewer 프레젠테이션 열기');
  await expect(dialog.locator('[data-screen-frame]')).toHaveCount(0);
  const box = (await device.boundingBox())!;
  // Sized from the panel height, not a small fixed box.
  expect(box.height).toBeGreaterThan(420);

  const list = dialog.getByRole('list', { name: 'Easy Contract Viewer 화면 목록' });
  const image = device.locator('img');
  const before = await image.getAttribute('src');
  const other = list.getByRole('button').first();
  await expect(other).not.toHaveAttribute('aria-current', 'true');
  await other.click();
  await expect(other).toHaveAttribute('aria-current', 'true');
  await expect(image).not.toHaveAttribute('src', before ?? '');
});
