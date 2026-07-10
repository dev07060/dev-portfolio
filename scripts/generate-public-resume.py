#!/usr/bin/env python3
"""Generate the Korean public resume from portfolio-approved information only."""

from __future__ import annotations

import re
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab import rl_config
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "oh-byeonghee-resume-ko.pdf"
FONT_CANDIDATES = (
    Path.home() / "Library/Fonts/PretendardVariable.ttf",
    Path("/System/Library/Fonts/Supplemental/AppleGothic.ttf"),
)

INK = colors.HexColor("#1F1B16")
MUTED = colors.HexColor("#665E54")
ACCENT = colors.HexColor("#0F766E")
ACCENT_SOFT = colors.HexColor("#E8F1EF")
LINE = colors.HexColor("#D9E4E1")
PAPER = colors.HexColor("#FAF7F2")

PROFILE = {
    "name": "오병희",
    "role": "크로스플랫폼 개발자 · 로컬 RAG 엔지니어",
    "position": "Flutter · 온디바이스 Retrieval/RAG · LLM 백엔드",
    "positioning": "모바일 제품과 로컬 검색 엔진을 설계·구현하고 평가와 운영까지 연결합니다.",
    "email": "byeongheeoh51@gmail.com",
    "github": "https://github.com/dev07060",
    "experience": "총 5년 5개월",
}

SKILLS = [
    "Flutter · Dart · iOS/Android",
    "Rust FFI · SQLite · HNSW · BM25",
    "ONNX · 문서 파싱 · RAG context",
    "TypeScript · Node.js · Python · FastAPI",
    "Firebase/FCM · Sentry · WebSocket",
    "Fastlane · GitHub Actions · 검색 평가",
]

PROJECTS = [
    {
        "title": "mobile_rag_engine",
        "label": "공개 패키지 · pub.dev 0.18.6",
        "problem": "Flutter 앱에서 문서를 서버에 업로드하지 않고 로컬 검색과 LLM-ready context 생성을 처리하는 패키지입니다.",
        "work": "Flutter facade와 Dart orchestration, Rust FFI 검색 코어를 분리하고 문서 파싱, ONNX embedding, SQLite, HNSW, BM25, 후보 결합 경로를 구현했습니다.",
        "result": "공개 API, 예제, 문서와 릴리스 패키징을 포함한 0.18.6을 배포했습니다. 패키지는 retrieval과 context 생성까지 책임지고 LLM provider와 채팅 UX는 고정하지 않습니다.",
        "links": [
            ("GitHub", "https://github.com/dev07060/mobile_rag_engine"),
            ("pub.dev", "https://pub.dev/packages/mobile_rag_engine"),
        ],
    },
    {
        "title": "Easy Contract Viewer",
        "label": "Flutter 제품 적용 사례",
        "problem": "보험 약관 PDF를 로컬에서 검색하고 검토 결과를 정확한 원문 근거 위치로 다시 연결하는 제품 흐름입니다.",
        "work": "PDF 추출과 조항 인식 chunking, 페이지 좌표 보존, SQLite/HNSW/BM25 검색, 동의 기반 AI 요약과 로컬 fallback 경계를 구현했습니다.",
        "result": "검색과 분석 결과에서 매칭된 PDF 조항을 다시 열 수 있게 했고, AI 요약이 원문 확인을 대체하지 않도록 구성했습니다.",
        "links": [],
    },
    {
        "title": "Swifty-law",
        "label": "운영 중인 검색 · API",
        "problem": "공식 법령 데이터를 인용 가능한 단위로 정규화하고 검색된 공식 근거 안에서 답변하도록 설계한 검색 백엔드입니다.",
        "work": "Bronze/Silver/Gold 데이터 계층, SBERT dense와 Milvus BM25 sparse 검색, RRF 결합, golden retrieval set 회귀 게이트를 구성했습니다.",
        "result": "법령명, 조문 경로, 시행일, 출처 URL을 포함하는 검색 결과와 API를 제공하고 외부 API quota를 재시도 정책으로 보호합니다.",
        "links": [
            ("검색 서비스", "https://law-api.swifty.kr/search-info/"),
            ("API 문서", "https://law-api.swifty.kr/docs"),
        ],
    },
]

EXPERIENCE = [
    {
        "period": "2025.12 - 2026.02",
        "company": "메리츠화재해상보험",
        "role": "보험 판매자용 태블릿 RAG 개발",
        "type": "외주 · 프리랜서",
        "summary": "보험 판매자용 태블릿 앱에서 약관 RAG 탐색과 온디바이스 조항 요약 흐름을 개발했습니다.",
        "highlights": [
            "BM25+HNSW Hybrid Search에 RRF 융합 랭킹과 질의 유형별 가중치, Source Filter를 적용했습니다.",
            "PDF 조항 추출, 결과 하이라이트, 원문 위치 점프 탐색과 온디바이스 요약 카드를 구현했습니다.",
        ],
    },
    {
        "period": "2024.06 - 2025.05",
        "company": "㈜피에트",
        "role": "App Frontend 파트장",
        "type": "회사 근무",
        "summary": "FIET MEDI, FIET Partner, MVM Fitness 등 Flutter iOS/Android 앱 개발과 운영 안정화를 담당했습니다.",
        "highlights": [
            "BLE Notify jitter와 packet drop을 반영한 시간 기반 ROM 계산으로 장시간 누적 drift를 70% 이상 줄였습니다.",
            "실패 가능한 펌웨어 파서, Sentry 분석과 Fastlane/GitHub Actions 배포 자동화를 운영했습니다.",
        ],
    },
    {
        "period": "2024.03 - 2024.06",
        "company": "㈜인피니티익스체인지코리아",
        "role": "가상자산 거래소 모바일 개발",
        "type": "외주 · 상주",
        "summary": "Flutter, GetX, MVC 기반 가상자산 거래소 앱의 핵심 기능과 인증 흐름을 개발했습니다.",
        "highlights": [
            "실시간 시세 WebSocket의 연결 생명주기와 화면 반영 흐름을 최적화했습니다.",
            "회원정보 관리와 KYC 인증 과정의 상태 및 네트워크 예외 처리를 구현했습니다.",
        ],
    },
    {
        "period": "2021.09 - 2024.03",
        "company": "튜링바이오",
        "role": "앱개발 · 연구개발 주임연구원",
        "type": "회사 근무",
        "summary": "헬스케어와 정신건강 도메인의 Flutter 앱과 연구 과제 앱을 운영 안정성 관점에서 개발했습니다.",
        "highlights": [
            "센서 수집, MethodChannel 네이티브 처리와 백그라운드 lifecycle을 안정화했습니다.",
            "상담/CBT 흐름, ML Kit, STT/TTS 기능과 AES256, JWT, RBAC 보호 구조를 구현했습니다.",
        ],
    },
    {
        "period": "2020.01 - 2020.04",
        "company": "㈜영우",
        "role": "React Native · Node.js 개발",
        "type": "원격 외주",
        "summary": "React Native 기반 원단 재고 조회 앱과 Node.js API 서버를 개발했습니다.",
        "highlights": [
            "음성인식과 QR Code 기반 원단 정보 조회 흐름을 구현했습니다.",
            "Google BigQuery 기반 원단 정보 저장과 추천 기능을 개발했습니다.",
        ],
    },
    {
        "period": "2017.08 - 2018.08",
        "company": "한국와콤",
        "role": "개발팀 사원",
        "type": "회사 근무",
        "summary": "Node.js(Express)와 MySQL 기반 고객 상담 시스템을 설계하고 구축했습니다.",
        "highlights": [
            "문의 등록/답변/관리 UI, 텍스트 유사도 답변 추천과 자동 메일 발송을 구현했습니다.",
            "트랜잭션과 Row Lock으로 충돌을 방지하고 실행 계획 분석으로 다중 JOIN 구간을 개선했습니다.",
        ],
    },
]

PRIVATE_PATTERNS = [
    re.compile(r"\b01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}\b"),
    re.compile(r"(?:휴대폰|주소|거주지|생년월일|학력|희망\s*(?:연봉|급여|근무지)|병역|보훈|장애)\s*[:：]?"),
    re.compile(r"(?:연봉|급여)\s*[:：]?\s*[\d,]+\s*만?원"),
]


def find_font() -> Path:
    for candidate in FONT_CANDIDATES:
        if candidate.exists():
            return candidate
    raise FileNotFoundError("A Korean TrueType font is required to generate the resume.")


def flatten_public_content() -> str:
    values: list[str] = list(PROFILE.values()) + SKILLS
    for project in PROJECTS:
        values.extend(str(value) for key, value in project.items() if key != "links")
        values.extend(f"{label} {url}" for label, url in project["links"])
    for item in EXPERIENCE:
        values.extend(str(value) for key, value in item.items() if key != "highlights")
        values.extend(item["highlights"])
    return " ".join(values)


def assert_public_only() -> None:
    content = flatten_public_content()
    for pattern in PRIVATE_PATTERNS:
        if pattern.search(content):
            raise ValueError(f"Public resume content violates privacy pattern: {pattern.pattern}")


def paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(escape(text), style)


def section_title(title: str, styles: dict[str, ParagraphStyle]):
    return [
        Spacer(1, 4 * mm),
        paragraph(title, styles["section"]),
        Spacer(1, 1.5 * mm),
        HRFlowable(width="100%", thickness=0.7, color=ACCENT, spaceAfter=3 * mm),
    ]


def links_paragraph(links, styles: dict[str, ParagraphStyle]) -> Paragraph:
    markup = "  ·  ".join(
        f'<link href="{escape(url)}" color="#0F766E"><u>{escape(label)}</u></link>'
        for label, url in links
    )
    return Paragraph(f"공개 근거  {markup}", styles["evidence"])


def project_block(project, styles: dict[str, ParagraphStyle]):
    heading = Table(
        [[paragraph(project["title"], styles["item_title"]), paragraph(project["label"], styles["item_meta_right"])]],
        colWidths=[118 * mm, 57 * mm],
    )
    heading.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5 * mm),
            ]
        )
    )
    parts = [heading]
    for label, key in (("문제", "problem"), ("구현", "work"), ("결과", "result")):
        parts.append(Paragraph(f'<font color="#0F766E"><b>{label}</b></font>  {escape(project[key])}', styles["body_compact"]))
    if project["links"]:
        parts.append(links_paragraph(project["links"], styles))
    parts.extend([Spacer(1, 2.8 * mm), HRFlowable(width="100%", thickness=0.45, color=LINE, spaceAfter=2.8 * mm)])
    return KeepTogether(parts)


def experience_block(item, styles: dict[str, ParagraphStyle]):
    header = Table(
        [[paragraph(item["period"], styles["period"]), paragraph(f'{item["company"]}  |  {item["role"]}', styles["item_title"]), paragraph(item["type"], styles["item_meta_right"])]],
        colWidths=[34 * mm, 109 * mm, 32 * mm],
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.2 * mm),
            ]
        )
    )
    detail = [header, paragraph(item["summary"], styles["body_compact"])]
    detail.extend(paragraph(f"- {highlight}", styles["bullet"]) for highlight in item["highlights"])
    detail.extend([Spacer(1, 2.6 * mm), HRFlowable(width="100%", thickness=0.45, color=LINE, spaceAfter=2.6 * mm)])
    return KeepTogether(detail)


def on_page(canvas, doc):
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, 13 * mm, width - doc.rightMargin, 13 * mm)
    canvas.setFont("Pretendard", 7.2)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 8.5 * mm, "공개 포트폴리오 정보 기준 · 2026.07.11")
    canvas.drawRightString(width - doc.rightMargin, 8.5 * mm, f"{canvas.getPageNumber()} / 2")
    canvas.restoreState()


def build_resume() -> None:
    assert_public_only()
    rl_config.invariant = 1
    font_path = find_font()
    pdfmetrics.registerFont(TTFont("Pretendard", str(font_path)))
    pdfmetrics.registerFontFamily("Pretendard", normal="Pretendard", bold="Pretendard")

    base = getSampleStyleSheet()
    styles = {
        "name": ParagraphStyle("Name", parent=base["Normal"], fontName="Pretendard", fontSize=25, leading=29, textColor=INK, spaceAfter=2 * mm),
        "role": ParagraphStyle("Role", parent=base["Normal"], fontName="Pretendard", fontSize=12.5, leading=17, textColor=ACCENT, spaceAfter=1.2 * mm),
        "position": ParagraphStyle("Position", parent=base["Normal"], fontName="Pretendard", fontSize=8.6, leading=12, textColor=MUTED),
        "kicker": ParagraphStyle("Kicker", parent=base["Normal"], fontName="Pretendard", fontSize=7.3, leading=10, textColor=MUTED, alignment=TA_RIGHT),
        "contact": ParagraphStyle("Contact", parent=base["Normal"], fontName="Pretendard", fontSize=8.3, leading=12, textColor=INK, alignment=TA_RIGHT),
        "section": ParagraphStyle("Section", parent=base["Heading2"], fontName="Pretendard", fontSize=12.5, leading=15, textColor=INK, spaceAfter=0),
        "body": ParagraphStyle("Body", parent=base["BodyText"], fontName="Pretendard", fontSize=9.2, leading=14.5, textColor=INK, wordWrap="CJK"),
        "body_compact": ParagraphStyle("BodyCompact", parent=base["BodyText"], fontName="Pretendard", fontSize=8.25, leading=12.2, textColor=INK, wordWrap="CJK", spaceAfter=1.1 * mm),
        "bullet": ParagraphStyle("Bullet", parent=base["BodyText"], fontName="Pretendard", fontSize=7.9, leading=11.4, leftIndent=3 * mm, firstLineIndent=-3 * mm, textColor=INK, wordWrap="CJK", spaceAfter=0.6 * mm),
        "item_title": ParagraphStyle("ItemTitle", parent=base["Normal"], fontName="Pretendard", fontSize=9.4, leading=12, textColor=INK),
        "item_meta_right": ParagraphStyle("ItemMetaRight", parent=base["Normal"], fontName="Pretendard", fontSize=7.4, leading=10, textColor=MUTED, alignment=TA_RIGHT),
        "period": ParagraphStyle("Period", parent=base["Normal"], fontName="Pretendard", fontSize=7.6, leading=10, textColor=ACCENT),
        "evidence": ParagraphStyle("Evidence", parent=base["Normal"], fontName="Pretendard", fontSize=7.5, leading=10.5, textColor=MUTED, spaceAfter=0.7 * mm),
        "skill": ParagraphStyle("Skill", parent=base["Normal"], fontName="Pretendard", fontSize=8.1, leading=11, textColor=INK),
    }

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=17.5 * mm,
        leftMargin=17.5 * mm,
        topMargin=15 * mm,
        bottomMargin=18 * mm,
        title="오병희 공개용 개발자 이력서",
        author="오병희",
        subject="크로스플랫폼 개발자 · 로컬 RAG 엔지니어",
    )

    contact = (
        f'<link href="mailto:{PROFILE["email"]}" color="#1F1B16">{PROFILE["email"]}</link><br/>'
        f'<link href="{PROFILE["github"]}" color="#0F766E">github.com/dev07060</link>'
    )
    header = Table(
        [[
            [paragraph(PROFILE["name"], styles["name"]), paragraph(PROFILE["role"], styles["role"]), paragraph(PROFILE["position"], styles["position"])],
            [Paragraph("공개용 개발자 이력서", styles["kicker"]), Spacer(1, 3 * mm), Paragraph(contact, styles["contact"])],
        ]],
        colWidths=[116 * mm, 59 * mm],
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )

    story = [header, Spacer(1, 4 * mm), HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=3.5 * mm)]
    story.extend(section_title("프로필", styles))
    profile_copy = f'{PROFILE["positioning"]}  <font color="#0F766E">{PROFILE["experience"]}</font>'
    story.append(Paragraph(profile_copy, styles["body"]))
    story.extend(section_title("핵심 기술", styles))

    skill_rows = [[paragraph(SKILLS[i], styles["skill"]), paragraph(SKILLS[i + 1], styles["skill"])] for i in range(0, len(SKILLS), 2)]
    skill_table = Table(skill_rows, colWidths=[87.5 * mm, 87.5 * mm], hAlign="LEFT")
    skill_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), ACCENT_SOFT),
                ("BOX", (0, 0), (-1, -1), 0.4, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.white),
                ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 2.3 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.3 * mm),
            ]
        )
    )
    story.append(skill_table)
    story.extend(section_title("대표 기술 사례", styles))
    for project in PROJECTS:
        story.append(project_block(project, styles))

    story.append(PageBreak())
    story.extend(section_title("경력", styles))
    story.append(paragraph("최신순으로 역할과 대표 성과를 정리했습니다.", styles["position"]))
    story.append(Spacer(1, 3 * mm))
    for item in EXPERIENCE:
        story.append(experience_block(item, styles))

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)


if __name__ == "__main__":
    build_resume()
