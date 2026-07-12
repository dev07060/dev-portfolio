import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';

const seriousViolations = async (page: Page) => {
  await page.waitForTimeout(900);
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.filter(
    (violation) => violation.impact === 'critical' || violation.impact === 'serious'
  );
};

const expectHorizontallyReachable = async (page: Page, locator: Locator) => {
  await locator.scrollIntoViewIfNeeded();
  await expect(locator).toBeVisible();

  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(
    (viewport?.width ?? 0) + 1
  );
};

const gridColumnCount = (locator: Locator) =>
  locator.evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length
  );

const normalizedAnchors = (page: Page) =>
  page.locator('a').evaluateAll((anchors) =>
    anchors.map((anchor) => {
      const href = anchor.getAttribute('href');
      if (href === null) {
        return { href, normalizedHref: null, pathname: null };
      }

      const normalized = new URL(href, document.baseURI);
      return {
        href,
        normalizedHref: normalized.href,
        pathname: normalized.pathname.replace(/\/+$/, '') || '/',
      };
    })
  );

test('한국어 단일 홈과 skip link, 대표 사례 순서를 제공한다', async ({
  page,
  browserName,
}) => {
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.getByText('English', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Client', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Developer', { exact: true })).toHaveCount(0);
  const experienceLink = page.getByRole('link', { name: '경력', exact: true });
  const resumeLink = page.getByRole('link', { name: '이력서 보기', exact: true });
  await expect(experienceLink).toHaveCount(1);
  await expect(resumeLink).toHaveCount(2);
  for (const link of await resumeLink.all()) {
    await expect(link).toHaveAttribute('href', '/oh-byeonghee-resume-ko.pdf');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAttribute('rel', /noreferrer/);
  }

  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  const skipLink = page.getByRole('link', { name: '본문으로 건너뛰기' });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  await page.getByRole('link', { name: '대표 기술 사례', exact: true }).last().click();
  await expect(page).toHaveURL(/#featured-work$/);
  await expect(page.getByRole('heading', { name: '대표 기술 사례' })).toBeInViewport();

  const headings = await page
    .locator('#featured-work article h3')
    .evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(headings).toEqual(['mobile_rag_engine', 'Easy Contract Viewer', 'Swifty-law']);

  await experienceLink.click();
  await expect(page).toHaveURL(/#experience$/);
  await expect(page.getByRole('heading', { name: '경력과 역할' })).toBeInViewport();
  await expect(page.locator('#experience > div ol > li')).toHaveCount(6);
});

test('프리랜서 전달용 라우트는 공개 홈에서 숨겨지고 검색 비노출 계약을 제공한다', async ({
  page,
}) => {
  await page.goto('/');
  const publicHomeAnchors = await normalizedAnchors(page);
  expect(
    publicHomeAnchors.filter((anchor) => anchor.pathname === '/freelancer')
  ).toEqual([]);

  await page.goto('/freelancer');

  const freelancerAnchors = await normalizedAnchors(page);
  expect(freelancerAnchors.filter((anchor) => anchor.pathname === '/')).toEqual(
    []
  );

  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute('content', /noindex/);
  await expect(robots).toHaveAttribute('content', /nofollow/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    '모바일 제품화와 문서·PDF 검색/RAG 프로젝트 수행 경험을 정리한 전달용 포트폴리오입니다.'
  );

  await expect(
    page.getByRole('link', {
      name: '일반 포트폴리오로 돌아가기',
      exact: true,
    })
  ).toHaveCount(0);
  await expect(
    page.getByText('일반 포트폴리오로 돌아가기', { exact: true })
  ).toHaveCount(0);

  for (const copy of [
    '모바일 제품 · 문서 검색/RAG 프로젝트 수행 개발자',
    '크로스플랫폼 앱 · Native 연동 · Retrieval/RAG · FastAPI',
    '기존 모바일 제품의 고도화부터 문서·PDF 검색 기능과 검색 백엔드까지 구현합니다.',
    '모바일 앱 구축·고도화',
    '모바일 제품, 문서 검색 엔진, 운영 가능한 검색 백엔드로 이어지는 수행 사례입니다.',
    '모바일 제품이나 문서 검색 기능을 개발·개선하려고 하시나요?',
  ]) {
    await expect(page.getByText(copy, { exact: true })).toBeVisible();
  }

  await expect(
    page.getByRole('link', { name: '이력서 보기', exact: true })
  ).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: '프로젝트 상담', exact: true })
  ).toHaveCount(2);
  for (const contactLink of await page
    .getByRole('link', { name: '프로젝트 상담', exact: true })
    .all()) {
    await expect(contactLink).toHaveAttribute(
      'href',
      `mailto:byeongheeoh51@gmail.com?subject=${encodeURIComponent(
        '[프로젝트 문의] 모바일 제품 · 문서 RAG 개발'
      )}`
    );
  }

  const headings = await page
    .locator('#featured-work article h3')
    .evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(headings).toEqual([
    'Easy Contract Viewer',
    'mobile_rag_engine',
    'Swifty-law',
  ]);

  const detailButton = page.getByRole('button', {
    name: 'Easy Contract Viewer 프로젝트 상세 열기',
  });
  await detailButton.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: /Easy Contract Viewer/ });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(detailButton).toBeFocused();
});

test('sitemap 출력은 없거나 프리랜서 URL pathname을 포함하지 않는다', async ({
  page,
  request,
}) => {
  const response = await request.get('/sitemap.xml');

  if (response.status() === 404) {
    return;
  }

  expect(response.ok()).toBe(true);
  const xml = await response.text();
  const sitemap = await page.evaluate(
    ({ source, baseUrl }) => {
      const document = new DOMParser().parseFromString(source, 'application/xml');
      const parserError = document.querySelector('parsererror')?.textContent ?? null;
      const locations = Array.from(document.getElementsByTagName('*'))
        .filter((element) => element.localName === 'loc')
        .map((location) => {
          const value = location.textContent?.trim() ?? '';
          const normalized = new URL(value, baseUrl);
          return {
            value,
            normalizedHref: normalized.href,
            pathname: normalized.pathname.replace(/\/+$/, '') || '/',
          };
        });

      return { parserError, locations };
    },
    { source: xml, baseUrl: response.url() }
  );

  expect(sitemap.parserError).toBeNull();
  expect(
    sitemap.locations.filter((location) => location.pathname === '/freelancer')
  ).toEqual([]);
});

test('두 실제 라우트 설정의 모든 프로젝트 ID가 공유 프로젝트로 렌더링된다', async ({
  page,
}) => {
  const additionalTitles = [
    'Easy Contract Viewer Server',
    'HaruCheck',
    '피에트 피트니스 트레이너',
    'Weedool (TuringBio)',
  ];
  const routes = [
    {
      path: '/',
      featuredTitles: [
        'mobile_rag_engine',
        'Easy Contract Viewer',
        'Swifty-law',
      ],
    },
    {
      path: '/freelancer',
      featuredTitles: [
        'Easy Contract Viewer',
        'mobile_rag_engine',
        'Swifty-law',
      ],
    },
  ];

  for (const route of routes) {
    await page.goto(route.path);

    await expect(page.locator('#featured-work article')).toHaveCount(
      route.featuredTitles.length
    );
    await expect(page.locator('#additional-projects article')).toHaveCount(
      additionalTitles.length
    );

    const renderedFeaturedTitles = await page
      .locator('#featured-work article h3')
      .allTextContents();
    const renderedAdditionalTitles = await page
      .locator('#additional-projects article h3')
      .allTextContents();
    expect(renderedFeaturedTitles.map((title) => title.trim())).toEqual(
      route.featuredTitles
    );
    expect(renderedAdditionalTitles.map((title) => title.trim())).toEqual(
      additionalTitles
    );
    await expect(
      page.getByRole('heading', {
        name: 'Motgo 맛집 투표 서비스',
        exact: true,
      })
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', {
        name: 'Motgo 맛집 투표 서비스 프로젝트 상세 열기',
      })
    ).toHaveCount(0);

    const serverButton = page.getByRole('button', {
      name: 'Easy Contract Viewer Server 프로젝트 상세 열기',
    });
    await serverButton.click();
    const serverDialog = page.getByRole('dialog', {
      name: /Easy Contract Viewer Server/,
    });
    await expect(serverDialog).toBeVisible();
    await expect(serverDialog.getByText('— 백엔드 API', { exact: true })).toBeVisible();
    await expect(
      serverDialog.getByText('비공개 구현 · 로컬 검증', { exact: true })
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(serverDialog).toBeHidden();
  }
});

test('경력 우선순위는 공개 홈의 최신순과 프리랜서의 수행 적합도순을 구분한다', async ({
  page,
}) => {
  const experienceCompanies = () =>
    page
      .locator('#experience > div ol > li')
      .getByRole('heading', { level: 3 })
      .allTextContents();

  await page.goto('/');
  expect(await experienceCompanies()).toEqual([
    '메리츠화재해상보험',
    '㈜피에트',
    '㈜인피니티익스체인지코리아',
    '튜링바이오',
    '㈜영우',
    '한국와콤',
  ]);

  await page.goto('/freelancer');
  expect(await experienceCompanies()).toEqual([
    '㈜피에트',
    '메리츠화재해상보험',
    '㈜인피니티익스체인지코리아',
    '튜링바이오',
    '㈜영우',
    '한국와콤',
  ]);
});

test('경력 우선순위 설명은 각 라우트의 실제 정렬 기준을 안내한다', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText('최신순으로 역할과 대표 성과를 요약했습니다.', { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText('프로젝트 수행 적합도를 기준으로 역할과 대표 성과를 요약했습니다.', {
      exact: true,
    })
  ).toHaveCount(0);

  await page.goto('/freelancer');
  await expect(
    page.getByText('프로젝트 수행 적합도를 기준으로 역할과 대표 성과를 요약했습니다.', {
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByText('최신순으로 역할과 대표 성과를 요약했습니다.', { exact: true })
  ).toHaveCount(0);
});

test('프리랜서 전달용 라우트는 390px과 320px에서 가로 유실이 없다', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 320, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/freelancer');
    await page.evaluate(() => document.fonts.ready);

    const dimensions = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    }));
    expect(dimensions.overflow).toBe(0);
    if (viewport.width === 390) {
      expect(dimensions.height).toBeLessThanOrEqual(8_000);
    }

    await expect(
      page.getByText('일반 포트폴리오로 돌아가기', { exact: true })
    ).toHaveCount(0);
    await expectHorizontallyReachable(
      page,
      page.getByRole('link', { name: '프로젝트 상담', exact: true }).first()
    );

    await page
      .getByRole('button', {
        name: 'Easy Contract Viewer Server 프로젝트 상세 열기',
      })
      .click();
    const serverDialog = page.getByRole('dialog', {
      name: /Easy Contract Viewer Server/,
    });
    await expect(serverDialog).toBeVisible();
    await expectHorizontallyReachable(
      page,
      serverDialog.getByRole('heading', {
        name: 'Easy Contract Viewer Server',
        exact: true,
      })
    );
    const modalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    expect(modalOverflow).toBe(0);
    await page.keyboard.press('Escape');
    await expect(serverDialog).toBeHidden();
  }
});

test('320px 앱바가 모든 링크와 44px 터치 영역을 처음부터 제공한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: '주요 탐색' });
  const links = nav.getByRole('link');
  await expect(nav.getByRole('link', { name: '이력서 보기', exact: true })).toHaveCount(0);
  const labels = await links.evaluateAll((items) =>
    items.map((item) => item.textContent?.trim())
  );
  expect(labels).toEqual(['DEV PORTFOLIO', '기술 사례', '경력', '연락']);

  const boxes = await links.evaluateAll((items) =>
    items.map((item) => {
      const box = item.getBoundingClientRect();
      return { x: box.x, width: box.width, height: box.height };
    })
  );
  for (const box of boxes) {
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }

  const internalOverflow = await nav.evaluate((element) => {
    const scroller = element.querySelector('div > div');
    return scroller ? scroller.scrollWidth - scroller.clientWidth : 0;
  });
  expect(internalOverflow).toBe(0);

  const overflowingDescendants = await nav.locator('*').evaluateAll((elements) =>
    elements
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => element.tagName)
  );
  expect(overflowingDescendants).toEqual([]);
});

test('390px 채용 스캔 흐름은 8000px 안에 전체 정보를 제공한다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  const dimensions = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  expect(dimensions.height).toBeLessThanOrEqual(8_000);
  expect(dimensions.overflow).toBe(0);
});

test('경력은 대표 성과만 먼저 보여주고 나머지를 펼쳐 제공한다', async ({ page }) => {
  await page.goto('/#experience');

  const firstExperience = page.locator('#experience > div ol > li').first();
  const hiddenSummary = firstExperience.getByText(
    '보험 판매자용 태블릿 앱에서 약관 RAG 탐색과 온디바이스 조항 요약 흐름을 개발했습니다.',
    { exact: true }
  );
  await expect(hiddenSummary).toBeHidden();

  await firstExperience.getByText('상세 경력 보기', { exact: true }).click();
  await expect(hiddenSummary).toBeVisible();
  await expect(
    firstExperience.getByRole('link', { name: 'mobile_rag_engine', exact: true })
  ).toBeVisible();
});

test('320px 추가 프로젝트 archive가 네 행과 기존 상세를 제공한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#additional-projects');

  const archive = page.locator('#additional-projects');
  const rows = archive.locator('article');
  await expect(rows).toHaveCount(4);
  await expect(archive.locator('img')).toHaveCount(0);

  for (const title of [
    'Easy Contract Viewer Server',
    'HaruCheck',
    '피에트 피트니스 트레이너',
    'Weedool (TuringBio)',
  ]) {
    await expectHorizontallyReachable(
      page,
      archive.getByRole('heading', { name: title, exact: true })
    );
  }

  const trainerRow = archive.locator('article').filter({
    hasText: '피에트 피트니스 트레이너',
  });
  await expect(trainerRow).toContainText(
    'BLE 실시간 센서 연동, 트레이너용 분석 리포트, Fastlane·GitHub Actions 배포 자동화를 구현했습니다.'
  );

  const detailButton = archive.getByRole('button', {
    name: 'HaruCheck 프로젝트 상세 열기',
  });
  await expect(detailButton).toHaveText('상세 보기');
  await detailButton.click();
  await expect(page.getByRole('dialog', { name: /HaruCheck/ })).toBeVisible();
});

test('피에트 트레이너 상세는 스플래시 대신 인바디 리포트를 첫 근거로 제공한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#additional-projects');
  await page
    .getByRole('button', {
      name: '피에트 피트니스 트레이너 프로젝트 상세 열기',
    })
    .click();

  const dialog = page.getByRole('dialog', {
    name: /피에트 피트니스 트레이너/,
  });
  const preview = dialog.getByRole('button', {
    name: '피에트 피트니스 트레이너 결과 리포트 - 인바디 프레젠테이션 열기',
  });

  const previewImage = preview.locator('img');
  const previewImageSrc = await previewImage.getAttribute('src');
  expect(previewImageSrc).not.toBeNull();
  expect(
    new URL(previewImageSrc ?? '', page.url()).searchParams.get('url')
  ).toBe('/images/fiet-fitness-trainer/report-inbody.png');
  await expect(previewImage).toHaveAttribute(
    'alt',
    '피에트 피트니스 트레이너 결과 리포트 - 인바디'
  );
  expect(
    await previewImage.evaluate((element) => ({
      objectFit: getComputedStyle(element).objectFit,
      objectPosition: getComputedStyle(element).objectPosition,
    }))
  ).toEqual({
    objectFit: 'cover',
    objectPosition: '50% 0%',
  });
  await preview.click();
  await expect(
    page.getByText('화면 2 / 6: 결과 리포트 - 인바디', { exact: true })
  ).toBeVisible();
});

test('피에트 사용자 앱은 데이터에 남고 공개 프로젝트 링크에서는 제외된다', async ({
  page,
}) => {
  await page.goto('/#experience');

  await expect(
    page.locator('#additional-projects').getByRole('heading', {
      name: '피에트 피트니스',
      exact: true,
    })
  ).toHaveCount(0);

  const fietExperience = page
    .locator('#experience > div ol > li')
    .filter({ hasText: '㈜피에트' });
  await fietExperience.getByText('상세 경력 보기', { exact: true }).click();
  await expect(
    fietExperience.getByRole('link', {
      name: '피에트 피트니스 트레이너',
      exact: true,
    })
  ).toBeVisible();
  await expect(
    fietExperience.getByRole('link', {
      name: '피에트 피트니스',
      exact: true,
    })
  ).toHaveCount(0);
});

test('390px 프로젝트 상세은 제목 다음에 eager 시각 근거를 제공한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#featured-work');
  await page
    .getByRole('button', { name: 'mobile_rag_engine 프로젝트 상세 열기' })
    .click();

  const dialog = page.getByRole('dialog', { name: /mobile_rag_engine/ });
  const title = dialog.getByRole('heading', { name: 'mobile_rag_engine' });
  const preview = dialog.getByRole('button', {
    name: 'mobile_rag_engine 프레젠테이션 열기',
  });
  const problem = dialog.getByRole('heading', { name: '— 문제와 제약' });

  await expect(preview).toHaveCount(1);
  const [titleBox, previewBox, problemBox] = await Promise.all([
    title.boundingBox(),
    preview.boundingBox(),
    problem.boundingBox(),
  ]);
  expect(titleBox).not.toBeNull();
  expect(previewBox).not.toBeNull();
  expect(problemBox).not.toBeNull();
  expect(titleBox?.y ?? Infinity).toBeLessThan(previewBox?.y ?? -Infinity);
  expect(previewBox?.y ?? Infinity).toBeLessThan(problemBox?.y ?? -Infinity);

  const previewImage = preview.locator('img');
  await expect(previewImage).toHaveCount(1);
  await expect(previewImage).toHaveAttribute('loading', 'eager');
});

test('320px 프로젝트 상세의 긴 기술 제목이 잘리지 않는다', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await page
    .getByRole('button', { name: 'mobile_rag_engine 프로젝트 상세 열기' })
    .click();

  const title = page.getByRole('heading', { name: 'mobile_rag_engine' });
  await expect(title).toBeVisible();
  const overflow = await title.evaluate(
    (element) => element.scrollWidth - element.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('카드 dialog가 focus trap, Escape, focus restoration을 제공한다', async ({ page }) => {
  await page.goto('/');
  const detailButton = page.getByRole('button', {
    name: 'mobile_rag_engine 프로젝트 상세 열기',
  });

  await detailButton.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: /mobile_rag_engine/ });
  const closeButton = page.getByRole('button', {
    name: 'mobile_rag_engine 프로젝트 상세 닫기',
  });
  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();

  for (let index = 0; index < 14; index += 1) {
    await page.keyboard.press('Tab');
    await expect
      .poll(() => dialog.evaluate((node) => node.contains(document.activeElement)))
      .toBe(true);
  }
  for (let index = 0; index < 6; index += 1) {
    await page.keyboard.press('Shift+Tab');
    await expect
      .poll(() => dialog.evaluate((node) => node.contains(document.activeElement)))
      .toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(detailButton).toBeFocused();
});

test('프레젠테이션이 slide status와 preview focus restoration을 제공한다', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: 'mobile_rag_engine 프로젝트 상세 열기' })
    .click();

  const previewButton = page.getByRole('button', {
    name: 'mobile_rag_engine 프레젠테이션 열기',
  });
  await previewButton.click();

  const presentation = page.getByRole('dialog');
  const liveStatus = page.locator('[aria-live="polite"]');
  const presentationClose = page.getByRole('button', { name: '프레젠테이션 닫기' });
  await expect(presentation).toBeVisible();
  await expect(presentationClose).toBeFocused();
  const before = await liveStatus.textContent();
  await page.getByRole('button', { name: '다음 화면' }).click();
  await expect(liveStatus).not.toHaveText(before ?? '');

  await page.keyboard.press('Escape');
  await expect(presentationClose).toBeHidden();
  await expect(previewButton).toBeFocused();
});

test('스크롤 가능한 screenshot region을 keyboard로 탐색한다', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Swifty-law 프로젝트 상세 열기' }).click();
  await page.getByRole('button', { name: 'Swifty-law 프레젠테이션 열기' }).click();
  await page.getByRole('button', { name: '이전 화면' }).click();

  const region = page.getByRole('region', {
    name: '검색 결과·인용 스크린샷 스크롤 영역',
  });
  await expect(region).toBeVisible();
  await expect
    .poll(() =>
      region.evaluate((element) => element.scrollHeight > element.clientHeight)
    )
    .toBe(true);
  await region.focus();
  const before = await region.evaluate((element) => element.scrollTop);
  await page.keyboard.press('PageDown');
  await expect.poll(() => region.evaluate((element) => element.scrollTop)).toBeGreaterThan(before);
});

test('reduced motion에서 named animation을 제거한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const animationName = await page
    .locator('.animate-fade-in-up')
    .evaluate((element) => getComputedStyle(element).animationName);
  expect(animationName).toBe('none');
});

test('home, modal, presentation에 critical/serious axe 위반이 없다', async ({ page }) => {
  await page.goto('/');
  expect(await seriousViolations(page)).toEqual([]);

  await page
    .getByRole('button', { name: 'mobile_rag_engine 프로젝트 상세 열기' })
    .click();
  expect(await seriousViolations(page)).toEqual([]);

  await page
    .getByRole('button', { name: 'mobile_rag_engine 프레젠테이션 열기' })
    .click();
  expect(await seriousViolations(page)).toEqual([]);
});

test('home, modal, presentation에 browser console 경고와 오류가 없다', async ({
  page,
}) => {
  const consoleFailures: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning' || message.type() === 'error') {
      consoleFailures.push(`${message.type()}: ${message.text()}`);
    }
  });

  await page.goto('/');
  await page
    .getByRole('button', { name: 'mobile_rag_engine 프로젝트 상세 열기' })
    .click();
  await page
    .getByRole('button', { name: 'mobile_rag_engine 프레젠테이션 열기' })
    .click();
  await page.getByRole('button', { name: '다음 화면' }).click();
  await page.waitForTimeout(1_200);

  expect(consoleFailures).toEqual([]);
});

test('1440px home이 LCP 이미지 우선순위 경고 없이 안정화된다', async ({ page }) => {
  const consoleFailures: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning' || message.type() === 'error') {
      consoleFailures.push(`${message.type()}: ${message.text()}`);
    }
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#featured-work');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('#featured-work img')).toHaveCount(3);
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll<HTMLImageElement>('#featured-work img')).every(
      (image) => image.complete
    )
  );
  await page.waitForTimeout(1_000);

  expect(consoleFailures).toEqual([]);
});

for (const viewport of [
  { width: 360, height: 740, columns: 1, label: 'mobile' },
  { width: 390, height: 844, columns: 1, label: 'mobile' },
  { width: 640, height: 900, columns: 1, label: '200% zoom reflow proxy' },
  { width: 768, height: 1024, columns: 2, label: 'tablet' },
  { width: 1024, height: 600, columns: 3, label: 'desktop' },
  { width: 1440, height: 900, columns: 3, label: 'desktop' },
  { width: 320, height: 800, columns: 1, label: '400% zoom reflow proxy' },
]) {
  test(`${viewport.width}×${viewport.height} ${viewport.label}에서 콘텐츠와 control을 잃지 않는다`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);

    await expectHorizontallyReachable(
      page,
      page.getByRole('heading', { level: 1, name: '오병희' })
    );
    await expectHorizontallyReachable(
      page,
      page.getByRole('link', { name: '채용 관련 이메일' }).first()
    );

    const featuredGrid = page.locator('#featured-work .grid').first();
    expect(await gridColumnCount(featuredGrid)).toBe(viewport.columns);

    const firstCard = page.locator('#featured-work article').first();
    await expectHorizontallyReachable(
      page,
      firstCard.getByRole('heading', { name: 'mobile_rag_engine' })
    );
    await expectHorizontallyReachable(
      page,
      firstCard.getByRole('link', { name: 'GitHub' })
    );

    await firstCard
      .getByRole('button', { name: 'mobile_rag_engine 프로젝트 상세 열기' })
      .click();
    const dialog = page.getByRole('dialog', { name: /mobile_rag_engine/ });
    await expect(dialog).toBeVisible();
    await expectHorizontallyReachable(
      page,
      dialog.getByRole('heading', { name: 'mobile_rag_engine' })
    );
    await expectHorizontallyReachable(
      page,
      dialog.getByRole('button', { name: 'mobile_rag_engine 프레젠테이션 열기' })
    );
    await page.getByRole('button', { name: 'mobile_rag_engine 프로젝트 상세 닫기' }).click();
  });
}
