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

const normalizedAnchors = (page: Page) =>
  page.locator('a').evaluateAll((anchors) =>
    anchors.map((anchor) => {
      const href = anchor.getAttribute('href');
      if (href === null) {
        return { href, normalizedHref: null, sameOrigin: false, pathname: null };
      }

      const normalized = new URL(href, document.baseURI);
      return {
        href,
        normalizedHref: normalized.href,
        sameOrigin: normalized.origin === window.location.origin,
        pathname: normalized.pathname.replace(/\/+$/, '') || '/',
      };
    })
  );

const caseHeadings = (page: Page) =>
  page
    .locator('#case-01 h2, #case-02 h2, #case-03 h2')
    .evaluateAll((items) => items.map((item) => item.textContent?.trim()));

const caseDetailButton = (page: Page, title: string) =>
  page.getByRole('button', { name: `사례 자세히, ${title}`, exact: true });

const additionalCaseButton = (page: Page, number: number) =>
  page.getByRole('button', { name: new RegExp(`^프로젝트 사례 #${number},`) }).first();

const additionalCases = [
  [4, 'Easy Contract Viewer Server'],
  [5, '피에트 피트니스 트레이너'],
  [6, '피에트 피트니스'],
  [7, 'HaruCheck'],
  [8, 'Weedool (TuringBio)'],
] as const;

test('한국어 단일 홈과 skip link, 대표 사례 순서를 제공한다', async ({
  page,
  browserName,
}) => {
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.getByText('English', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Client', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Developer', { exact: true })).toHaveCount(0);
  const nav = page.locator('nav[aria-label="주요 메뉴"]');
  const experienceLink = nav.getByRole('link', { name: '경력', exact: true });
  const resumeLink = page.getByRole('link', { name: '이력서 PDF', exact: true });
  await expect(page.getByRole('link', { name: '경력', exact: true })).toHaveCount(1);
  await expect(resumeLink).toHaveCount(3);
  for (const link of await resumeLink.all()) {
    await expect(link).toHaveAttribute('href', '/oh-byeonghee-resume-ko.pdf');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }

  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  const skipLink = page.getByRole('link', { name: '본문으로 건너뛰기' });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  await nav.getByRole('link', { name: '작업', exact: true }).click();
  await expect(page).toHaveURL(/#case-01$/);
  await expect(page.locator('#case-01-title')).toBeInViewport();

  expect(await caseHeadings(page)).toEqual([
    'Flutter 공개 패키지',
    'Easy Contract Viewer',
    '기업 법령 검토 엔진(이음)',
  ]);

  await experienceLink.click();
  await expect(page).toHaveURL(/#career$/);
  await expect(page.locator('#career-title')).toBeInViewport();
  await expect(page.locator('#career ol > li')).toHaveCount(6);
});

test('프리랜서 전달용 라우트는 공개 홈에서 숨겨지고 검색 비노출 계약을 제공한다', async ({
  page,
}) => {
  await page.goto('/');
  const publicHomeAnchors = await normalizedAnchors(page);
  expect(
    publicHomeAnchors.filter((anchor) => anchor.sameOrigin && anchor.pathname === '/freelancer')
  ).toEqual([]);

  await page.goto('/freelancer');

  const freelancerAnchors = await normalizedAnchors(page);
  expect(freelancerAnchors.filter((anchor) => anchor.sameOrigin && anchor.pathname === '/')).toEqual(
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

  await expect(
    page.getByRole('link', { name: '프리랜서 포트폴리오', exact: true })
  ).toBeVisible();
  const hero = page.locator('#top');
  for (const copy of [
    '모바일 제품 · 문서 검색/RAG 프로젝트 수행 개발자',
    '크로스플랫폼 앱 · Native 연동 · Retrieval/RAG · FastAPI',
    '기존 모바일 제품의 고도화부터 문서·PDF 검색 기능과 검색 백엔드까지 구현합니다.',
    '모바일 앱 구축·고도화',
  ]) {
    await expect(hero).toContainText(copy);
  }
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: '모바일 제품이나 문서 검색 기능을 개발·개선하려고 하시나요?',
      exact: true,
    })
  ).toBeVisible();

  await expect(page.getByRole('link', { name: /이력서/ })).toHaveCount(0);
  const contactLinks = page.getByRole('link', { name: '프로젝트 상담', exact: true });
  await expect(contactLinks).toHaveCount(1);
  const mailHref = `mailto:byeongheeoh51@gmail.com?subject=${encodeURIComponent(
    '[프로젝트 문의] 모바일 제품 · 문서 RAG 개발'
  )}`;
  await expect(contactLinks).toHaveAttribute('href', mailHref);
  await expect(
    page.locator('#contact').getByRole('link', { name: 'byeongheeoh51@gmail.com' })
  ).toHaveAttribute('href', mailHref);

  expect(await caseHeadings(page)).toEqual([
    'Easy Contract Viewer',
    'Flutter 공개 패키지',
    '기업 법령 검토 엔진(이음)',
  ]);

  const detailButton = caseDetailButton(page, 'Easy Contract Viewer');
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

test('두 실제 라우트 설정의 모든 프로젝트 ID가 사례 경로로 열린다', async ({
  page,
}) => {
  for (const path of ['/', '/freelancer']) {
    await page.goto(path);

    for (const title of ['mobile_rag_engine', 'Easy Contract Viewer', '기업 법령 검토 엔진(이음)']) {
      await expect(caseDetailButton(page, title)).toHaveCount(1);
    }
    for (const [number, title] of additionalCases) {
      await expect(
        page.getByRole('button', {
          name: `프로젝트 사례 #${number}, ${title} 화면 보기`,
          exact: true,
        }).first()
      ).toBeAttached();
    }
    await expect(page.getByText(/Motgo|맛집 투표/)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Motgo|맛집 투표/ })).toHaveCount(0);

    await additionalCaseButton(page, 4).click();
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

test('공개 홈과 프리랜서 경력은 모두 최신순으로 제공한다', async ({
  page,
}) => {
  const experienceCompanies = () =>
    page
      .locator('#career ol > li > h3')
      .evaluateAll((items) => items.map((item) => item.firstChild?.textContent?.trim()));
  const expected = [
    '메리츠화재해상보험',
    '㈜피에트',
    '㈜인피니티익스체인지코리아',
    '튜링바이오',
    '㈜영우',
    '한국와콤',
  ];

  await page.goto('/');
  expect(await experienceCompanies()).toEqual(expected);

  await page.goto('/freelancer');
  expect(await experienceCompanies()).toEqual(expected);
});

test('경력 설명은 두 라우트의 최신순 정렬 기준을 안내한다', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText('최신순으로 역할과 대표 성과를 요약했습니다.', { exact: true })
  ).toBeVisible();
  await page.goto('/freelancer');
  await expect(
    page.getByText('최신순으로 역할과 대표 성과를 요약했습니다.', { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText('프로젝트 수행 적합도를 기준으로 역할과 대표 성과를 요약했습니다.', {
      exact: true,
    })
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

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBe(0);

    await expect(
      page.getByText('일반 포트폴리오로 돌아가기', { exact: true })
    ).toHaveCount(0);
    await expectHorizontallyReachable(
      page,
      page.getByRole('link', { name: '프로젝트 상담', exact: true }).first()
    );

    await additionalCaseButton(page, 4).click();
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

test('320px 앱바가 두 라우트에서 겹침 없이 모든 링크와 44px 터치 영역을 제공한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });

  for (const route of [
    { path: '/', brand: '포트폴리오', labels: ['작업', '경력', '연락', '이력서 PDF'] },
    { path: '/freelancer', brand: '프리랜서 포트폴리오', labels: ['작업', '경력', '연락'] },
  ]) {
    await page.goto(route.path);

    const brand = page.locator('#top header').getByRole('link', {
      name: route.brand,
      exact: true,
    });
    await expect(brand).toBeVisible();
    const nav = page.locator('nav[aria-label="주요 메뉴"]');
    const links = nav.getByRole('link');
    const labels = await links.evaluateAll((items) =>
      items.map((item) => item.textContent?.trim())
    );
    expect(labels).toEqual(route.labels);

    const boxes = [
      await brand.evaluate((item) => item.getBoundingClientRect().toJSON()),
      ...(await links.evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().toJSON())
      )),
    ] as Array<{ x: number; y: number; width: number; height: number }>;
    for (const box of boxes) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(320);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    for (let a = 0; a < boxes.length; a += 1) {
      for (let b = a + 1; b < boxes.length; b += 1) {
        const first = boxes[a];
        const second = boxes[b];
        const overlaps =
          first.x < second.x + second.width - 0.5 &&
          second.x < first.x + first.width - 0.5 &&
          first.y < second.y + second.height - 0.5 &&
          second.y < first.y + first.height - 0.5;
        expect(overlaps).toBe(false);
      }
    }

    const internalOverflow = await nav.evaluate(
      (element) => element.scrollWidth - element.clientWidth
    );
    expect(internalOverflow).toBe(0);
  }
});

test('경력은 대표 성과만 먼저 보여주고 나머지를 펼쳐 제공한다', async ({ page }) => {
  await page.goto('/#career');

  const firstExperience = page.locator('#career ol > li').first();
  const hiddenSummary = firstExperience.getByText(
    '보험 판매자용 태블릿 앱에서 약관 RAG 탐색과 온디바이스 조항 요약 흐름을 개발했습니다.',
    { exact: true }
  );
  await expect(hiddenSummary).toBeHidden();

  await firstExperience.locator('details > summary', { hasText: '자세히' }).click();
  await expect(hiddenSummary).toBeVisible();
  await expect(
    firstExperience.getByRole('link', {
      name: '프로젝트 사례 #1, mobile_rag_engine',
      exact: true,
    })
  ).toBeVisible();
});

test('320px 추가 프로젝트 사례 #4–#8 버튼이 보이고 각각 기존 상세를 연다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');

  for (const [number, title] of additionalCases) {
    const button = additionalCaseButton(page, number);
    await expectHorizontallyReachable(page, button);
    const box = await button.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    await button.click();
    const dialog = page.getByRole('dialog', { name: new RegExp(title.replace(/[()]/g, '\\$&')) });
    await expect(dialog).toBeVisible();
    if (number === 5) {
      await expect(dialog).toContainText(
        'BLE 실시간 센서 연동, 트레이너용 분석 리포트, Fastlane·GitHub Actions 배포 자동화를 구현했습니다.'
      );
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  }
});

test('피에트 트레이너 상세는 스플래시 대신 인바디 리포트를 첫 근거로 제공한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await additionalCaseButton(page, 5).click();

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
    page.getByText('화면 2 / 6, 결과 리포트 - 인바디', { exact: true })
  ).toBeVisible();
});

test('피에트 경력의 프로젝트 사례 #5·#6으로 두 피에트 앱 상세를 모두 연다', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#career');

  const fietExperience = page.locator('#career ol > li').filter({ hasText: '㈜피에트' });
  await fietExperience.locator('details > summary', { hasText: '자세히' }).click();

  for (const [number, title, evidence] of [
    [5, '피에트 피트니스 트레이너', 'BLE 실시간 센서 연동'],
    [6, '피에트 피트니스', 'Firebase Cloud Messaging 기반 푸시 알림'],
  ] as const) {
    const button = fietExperience.getByRole('button', {
      name: `프로젝트 사례 #${number}, ${title} 화면 보기`,
      exact: true,
    });
    await expect(button).toBeVisible();
    await button.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(dialog).toContainText(evidence);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  }

  const search = page.getByLabel('포트폴리오 검색');
  await search.fill('피에트');
  const results = page.getByRole('list', { name: '검색 결과' });
  await expect(results).toContainText('피에트 피트니스 트레이너');
  await expect(results).toContainText(/피에트 피트니스(?! 트레이너)/);

  await expect(page.locator('main')).not.toContainText(/Motgo|맛집 투표/);
  await expect(page.getByRole('button', { name: /Motgo|맛집 투표/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Motgo|맛집 투표/ })).toHaveCount(0);
});

test('390px 프로젝트 상세은 제목 다음에 eager 시각 근거를 제공한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#case-01');
  await caseDetailButton(page, 'mobile_rag_engine').click();

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

test('320px와 390px 프로젝트 상세의 긴 기술 제목이 한 줄로 표시된다', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await caseDetailButton(page, 'mobile_rag_engine').click();

    const title = page.getByRole('heading', { name: 'mobile_rag_engine' });
    await expect(title).toBeVisible();
    const dimensions = await title.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        overflow: element.scrollWidth - element.clientWidth,
        height: element.getBoundingClientRect().height,
        lineHeight: Number.parseFloat(style.lineHeight),
      };
    });
    expect(dimensions.overflow).toBeLessThanOrEqual(0);
    expect(dimensions.height).toBeLessThanOrEqual(dimensions.lineHeight * 1.1);
  }
});

test('데스크톱 프로젝트 상세를 keyboard로 스크롤한다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await caseDetailButton(page, 'Easy Contract Viewer').click();

  const region = page.getByRole('region', {
    name: 'Easy Contract Viewer 프로젝트 상세',
    exact: true,
  });
  await expect(region).toBeVisible();
  await expect
    .poll(() => region.evaluate((element) => element.scrollHeight > element.clientHeight))
    .toBe(true);
  await region.focus();
  const before = await region.evaluate((element) => element.scrollTop);
  await page.keyboard.press('PageDown');
  await expect.poll(() => region.evaluate((element) => element.scrollTop)).toBeGreaterThan(before);
});

test('사례 자세히 dialog가 focus trap, Escape, focus restoration을 제공한다', async ({ page }) => {
  await page.goto('/');
  const detailButton = caseDetailButton(page, 'mobile_rag_engine');
  await expect(detailButton).toHaveAttribute('aria-haspopup', 'dialog');

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
  await caseDetailButton(page, 'mobile_rag_engine').click();

  const previewButton = page.getByRole('button', {
    name: 'mobile_rag_engine 프레젠테이션 열기',
  });
  await previewButton.click();

  const presentation = page.getByRole('dialog');
  // Scoped to the overlay: case #2's step indicator is another polite live region on the page.
  const liveStatus = presentation.locator('[aria-live="polite"]');
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
  // No public project ships a long-page screenshot any more; serve a retained long capture
  // (h/w ≈ 2.9) for the Ieum '시스템 구성' screen, which the data flags as scrollable.
  await page.route(/\/images\/law-info-engine\/architecture\.svg/, (route) =>
    route.fulfill({
      path: `${process.cwd()}/public/images/law-info-engine/search-ui-full.png`,
      contentType: 'image/png',
    })
  );
  await page.goto('/');
  await caseDetailButton(page, '기업 법령 검토 엔진(이음)').click();
  await page
    .getByRole('list', { name: '기업 법령 검토 엔진(이음) 화면 목록' })
    .getByRole('button', { name: '시스템 구성' })
    .click();
  await page.getByRole('button', { name: '기업 법령 검토 엔진(이음) 프레젠테이션 열기' }).click();

  const region = page.getByRole('region', {
    name: '시스템 구성 스크린샷 스크롤 영역',
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

test('reduced motion에서 named animation과 자동 입력을 제거한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.getByLabel('포트폴리오 검색')).toHaveValue('Flutter');
  await expect(page.getByRole('button', { name: '자동 입력 멈추기' })).toHaveCount(0);

  for (const selector of ['.search-result', '.search-mark']) {
    const elements = page.locator(selector);
    await expect(elements.first()).toBeAttached();
    const names = await elements.evaluateAll((items) =>
      items.map((item) => getComputedStyle(item).animationName)
    );
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((name) => name === 'none')).toBe(true);
  }

  const panelTransition = await page
    .locator('#case-01 .engine-panel')
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(
    panelTransition.split(',').every((duration) => Number.parseFloat(duration) <= 0.00001)
  ).toBe(true);
});

test('home, modal, presentation에 critical/serious axe 위반이 없다', async ({ page }) => {
  await page.goto('/');
  // The hero search autoplay re-renders results with a 300ms fade-in; stop it so
  // axe measures settled colors instead of a mid-animation frame.
  // Autoplay frames are intentionally not scanned; only the settled state is.
  const stopDemo = page.getByRole('button', { name: '자동 입력 멈추기' });
  await expect(stopDemo).toBeVisible();
  await stopDemo.click();
  await expect(stopDemo).toHaveCount(0);
  const results = page.getByRole('list', { name: '검색 결과' }).getByRole('listitem');
  await expect(results.first()).toHaveCSS('opacity', '1');
  await expect(results.last()).toHaveCSS('opacity', '1');
  expect(await seriousViolations(page)).toEqual([]);

  await caseDetailButton(page, 'mobile_rag_engine').click();
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
  await caseDetailButton(page, 'mobile_rag_engine').click();
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
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1_000);

  const caseImages = page.locator('#case-02 img, #case-03 img');
  await expect(caseImages).toHaveCount(4);
  // Scroll like a reader (wheel input) so the lazy case images load below the fold.
  await page.mouse.move(720, 450);
  const lawImage = page.locator('#case-03 img');
  for (let step = 0; step < 40; step += 1) {
    const top = await lawImage.evaluate((element) => element.getBoundingClientRect().top);
    if (top < 450) break;
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(100);
  }
  await expect(lawImage).toBeInViewport();
  await page.waitForFunction(() =>
    Array.from(
      document.querySelectorAll<HTMLImageElement>('#case-02 img, #case-03 img')
    ).every((image) => image.complete)
  );
  await page.waitForTimeout(1_000);

  expect(consoleFailures).toEqual([]);
});

for (const viewport of [
  { width: 360, height: 740, label: 'mobile' },
  { width: 390, height: 844, label: 'mobile' },
  { width: 640, height: 900, label: '200% zoom reflow proxy' },
  { width: 768, height: 1024, label: 'tablet' },
  { width: 1024, height: 600, label: 'desktop' },
  { width: 1440, height: 900, label: 'desktop' },
  { width: 320, height: 800, label: '400% zoom reflow proxy' },
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
      page.getByRole('link', { name: '이메일 보내기' }).first()
    );
    await expectHorizontallyReachable(page, page.getByLabel('포트폴리오 검색'));

    const contactActions = page.locator('#contact').getByRole('link');
    for (let index = 0; index < (await contactActions.count()); index += 1) {
      await expectHorizontallyReachable(page, contactActions.nth(index));
    }

    const firstCase = page.locator('#case-01');
    await expectHorizontallyReachable(
      page,
      firstCase.getByRole('heading', { level: 2, name: 'Flutter 공개 패키지' })
    );
    await expectHorizontallyReachable(
      page,
      firstCase.getByRole('link', { name: 'GitHub ↗' })
    );

    const detailButton = caseDetailButton(page, 'mobile_rag_engine');
    await expectHorizontallyReachable(page, detailButton);
    await detailButton.click();
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
