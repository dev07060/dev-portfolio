// e2e/portfolio-v1.spec.ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const additionalCases = [
  [4, 'Easy Contract Viewer Server'],
  [5, '피에트 피트니스 트레이너'],
  [6, 'HaruCheck'],
  [7, 'Weedool'],
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
  await expect(page.getByText('프로젝트 8개에서 찾기')).toBeVisible();

  await input.fill('BLE');
  await expect(results.getByRole('listitem')).toHaveCount(1);
  await expect(results).toContainText('피에트 피트니스 트레이너');
});

test('움직임 줄이기에서는 자동 입력 없이 Flutter 결과로 고정한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByLabel('포트폴리오 검색')).toHaveValue('Flutter');
  await expect(page.getByRole('button', { name: '자동 입력 멈추기' })).toHaveCount(0);
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
    for (const title of ['mobile_rag_engine', 'Easy Contract Viewer', 'Swifty-law']) {
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

test('사례 #4–#7은 프로젝트 사례 버튼으로 열리고 비공개 프로젝트는 나오지 않는다', async ({ page }) => {
  await page.goto('/');
  for (const [number, title] of additionalCases) {
    const button = page
      .getByRole('button', { name: new RegExp(`^프로젝트 사례 #${number}, ${title}.* 화면 보기$`) })
      .first();
    await expect(button).toHaveText(`프로젝트 사례 #${number}`);
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeVisible();
    await button.click();
    const dialog = page.getByRole('dialog', { name: new RegExp(title) });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  }

  await expect(page.getByRole('button', { name: /^프로젝트 사례 #8/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /^프로젝트 사례 #8/ })).toHaveCount(0);
  for (const hidden of [/피에트 피트니스(?! 트레이너)/, /Motgo/, /맛집 투표/]) {
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
