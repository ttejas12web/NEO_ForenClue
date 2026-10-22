export interface BasicEditorIconOption {
  id: string;
  label: string;
  category: 'general' | 'academic' | 'forensic' | 'communication' | 'navigation';
  svgContent: string;
}

/**
 * Curated set of 32 mostly-used Lucide-compatible 24x24 stroke SVG icons
 * for replacing or customizing icons anywhere on the website via the Live Text Editor.
 */
export const BASIC_EDITOR_ICONS: BasicEditorIconOption[] = [
  // Academic & Institutions
  {
    id: 'building-2',
    label: 'University / Building',
    category: 'academic',
    svgContent:
      '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  },
  {
    id: 'landmark',
    label: 'Institute / Landmark',
    category: 'academic',
    svgContent:
      '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  },
  {
    id: 'graduation-cap',
    label: 'Graduation / Degree',
    category: 'academic',
    svgContent:
      '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  },
  {
    id: 'book-open',
    label: 'Book / Course',
    category: 'academic',
    svgContent:
      '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  },
  {
    id: 'award',
    label: 'Award / Ranking',
    category: 'academic',
    svgContent:
      '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  },
  {
    id: 'trophy',
    label: 'Trophy / Top Rank',
    category: 'academic',
    svgContent:
      '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  },
  {
    id: 'file-text',
    label: 'Document / Syllabus',
    category: 'academic',
    svgContent:
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  },

  // Forensic & Science
  {
    id: 'shield-check',
    label: 'Verified / Shield',
    category: 'forensic',
    svgContent:
      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  },
  {
    id: 'scale',
    label: 'Scale / Compare / Law',
    category: 'forensic',
    svgContent:
      '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  },
  {
    id: 'microscope',
    label: 'Microscope / Lab',
    category: 'forensic',
    svgContent:
      '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
  },
  {
    id: 'fingerprint',
    label: 'Fingerprint / Forensics',
    category: 'forensic',
    svgContent:
      '<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>',
  },
  {
    id: 'dna',
    label: 'DNA / Biology',
    category: 'forensic',
    svgContent:
      '<path d="m10 16 1.5 1.5"/><path d="m14 8-1.5-1.5"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m16.5 10.5 1 1"/><path d="m17 6-2.891-2.891"/><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="m20 9 .891.891"/><path d="M3.109 14.109 4 15"/><path d="m6.5 12.5 1 1"/><path d="m7 18 2.891 2.891"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/>',
  },
  {
    id: 'cpu',
    label: 'Cyber / Digital',
    category: 'forensic',
    svgContent:
      '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  },

  // General & Badges
  {
    id: 'star',
    label: 'Star / Featured',
    category: 'general',
    svgContent:
      '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  },
  {
    id: 'check-circle',
    label: 'Check Circle',
    category: 'general',
    svgContent:
      '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  },
  {
    id: 'check',
    label: 'Checkmark',
    category: 'general',
    svgContent: '<path d="M20 6 9 17l-5-5"/>',
  },
  {
    id: 'sparkles',
    label: 'Sparkles / Highlight',
    category: 'general',
    svgContent:
      '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  },
  {
    id: 'zap',
    label: 'Lightning / Fast',
    category: 'general',
    svgContent:
      '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  },
  {
    id: 'flame',
    label: 'Flame / Trending',
    category: 'general',
    svgContent:
      '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  },
  {
    id: 'bookmark',
    label: 'Bookmark / Save',
    category: 'general',
    svgContent: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  },
  {
    id: 'heart',
    label: 'Heart / Favorite',
    category: 'general',
    svgContent:
      '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  },
  {
    id: 'info',
    label: 'Info / Notice',
    category: 'general',
    svgContent:
      '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  },

  // Location, Navigation & Search
  {
    id: 'map-pin',
    label: 'Location Pin',
    category: 'navigation',
    svgContent:
      '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  },
  {
    id: 'globe',
    label: 'Globe / Website',
    category: 'navigation',
    svgContent:
      '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  },
  {
    id: 'search',
    label: 'Search / Magnifier',
    category: 'navigation',
    svgContent:
      '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  },
  {
    id: 'external-link',
    label: 'External Link',
    category: 'navigation',
    svgContent:
      '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  },
  {
    id: 'arrow-right',
    label: 'Arrow Right',
    category: 'navigation',
    svgContent: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  },

  // Communication & People
  {
    id: 'users',
    label: 'Users / Community',
    category: 'communication',
    svgContent:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    id: 'phone',
    label: 'Phone / Call',
    category: 'communication',
    svgContent:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  },
  {
    id: 'mail',
    label: 'Email / Mail',
    category: 'communication',
    svgContent:
      '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  },
  {
    id: 'calendar',
    label: 'Calendar / Event',
    category: 'communication',
    svgContent:
      '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  },
  {
    id: 'video',
    label: 'Video / Webinar',
    category: 'communication',
    svgContent:
      '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  },
];

export const BASIC_ICON_MAP = new Map<string, BasicEditorIconOption>(
  BASIC_EDITOR_ICONS.map(icon => [icon.id, icon])
);

/**
 * Finds all SVG icons belonging to a selected element:
 * 1. The element itself if it is an `<svg>`.
 * 2. Direct or nested `<svg>` elements inside `element`.
 * 3. Sibling `<svg>` or icon-only sibling wrapper (e.g. `<div class="w-8 h-8"><svg /></div>`) inside `element.parentElement`.
 * 4. Sibling icon-only wrapper inside `element.parentElement.parentElement` for two-line badge/card headers.
 */
export function findAssociatedSvgs(element?: HTMLElement | null): SVGSVGElement[] {
  if (!element) return [];
  if (element.tagName.toLowerCase() === 'svg') {
    return [element as unknown as SVGSVGElement];
  }

  const childSvgs = Array.from(element.querySelectorAll('svg')) as SVGSVGElement[];
  if (childSvgs.length > 0) {
    return childSvgs;
  }

  const parent = element.parentElement;
  if (parent && !parent.closest('[data-admin-editor-ignore="true"]')) {
    const parentTag = parent.tagName.toLowerCase();
    if (
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'a', 'span', 'div', 'p', 'label', 'li'].includes(
        parentTag
      ) &&
      parent.children.length <= 6
    ) {
      const siblingSvgs: SVGSVGElement[] = [];
      for (const child of Array.from(parent.children)) {
        if (child === element) continue;
        if (child.tagName.toLowerCase() === 'svg') {
          siblingSvgs.push(child as unknown as SVGSVGElement);
        } else {
          // Check if sibling is a dedicated icon wrapper (contains svg and no text)
          const childText = (child.textContent || '').trim();
          if (childText.length === 0) {
            const nestedSvg = child.querySelector('svg');
            if (nestedSvg) {
              siblingSvgs.push(nestedSvg as SVGSVGElement);
            }
          }
        }
      }
      if (siblingSvgs.length > 0) {
        return siblingSvgs;
      }
    }

    // Check grandparent for badge/card structures like:
    // <div class="flex"><div class="icon-box"><svg/></div><div class="text-col"><div>Title</div><div>Sub</div></div></div>
    const grandParent = parent.parentElement;
    if (
      grandParent &&
      !grandParent.closest('[data-admin-editor-ignore="true"]') &&
      ['button', 'a', 'div', 'li', 'label', 'span', 'h1', 'h2', 'h3', 'h4'].includes(
        grandParent.tagName.toLowerCase()
      ) &&
      grandParent.children.length <= 6
    ) {
      const grandSiblingSvgs: SVGSVGElement[] = [];
      for (const uncle of Array.from(grandParent.children)) {
        if (uncle === parent) continue;
        if (uncle.tagName.toLowerCase() === 'svg') {
          grandSiblingSvgs.push(uncle as unknown as SVGSVGElement);
        } else {
          const uncleText = (uncle.textContent || '').trim();
          if (uncleText.length === 0 && uncle.children.length <= 2) {
            const nestedSvg = uncle.querySelector('svg');
            if (nestedSvg) {
              grandSiblingSvgs.push(nestedSvg as SVGSVGElement);
            }
          }
        }
      }
      if (grandSiblingSvgs.length > 0) {
        return grandSiblingSvgs;
      }
    }
  }

  return [];
}

export function findAssociatedSvg(element?: HTMLElement | null): SVGSVGElement | null {
  const svgs = findAssociatedSvgs(element);
  return svgs.length > 0 ? svgs[0] : null;
}

/**
 * Helper to find if an SVG sits inside a dedicated icon-only box wrapper
 * (e.g. `<div class="w-8 h-8 rounded-xl ..."><svg /></div>`) so hiding the icon
 * also hides the empty decorative box.
 */
function getDedicatedIconWrapper(svg: SVGSVGElement, rootElement: HTMLElement): HTMLElement | null {
  const parent = svg.parentElement;
  if (!parent || parent === document.body) return null;
  const tag = parent.tagName.toLowerCase();
  if (!['div', 'span', 'i', 'button', 'a'].includes(tag)) return null;
  const text = (parent.textContent || '').trim();
  if (text.length > 0) return null;
  // Check that all element children of parent are either the svg or decorative ping dots
  const nonDecorativeChildren = Array.from(parent.children).filter((c) => {
    const cTag = c.tagName.toLowerCase();
    if (cTag === 'svg') return false;
    if (cTag === 'span' && (c.textContent || '').trim().length === 0) return false;
    return true;
  });
  if (nonDecorativeChildren.length === 0) {
    return parent;
  }
  return null;
}

/**
 * Applies an icon replacement or deletion to the element's associated `<svg>`
 * (or injects a new inline `<svg>` if none existed and `iconName` is specified).
 */
export function applySvgOverrideToElement(
  element: HTMLElement | null | undefined,
  iconName?: string,
  iconDeleted?: boolean
) {
  if (!element) return;

  const svgs = findAssociatedSvgs(element);
  const primarySvg = svgs[0] || null;

  // If the user wants to delete the icon
  if (iconDeleted || iconName === 'none') {
    svgs.forEach((svg) => {
      if (!svg.hasAttribute('data-wt-orig-svg')) {
        svg.setAttribute('data-wt-orig-svg', svg.innerHTML);
      }
      svg.style.setProperty('display', 'none', 'important');
      svg.setAttribute('data-wt-icon-deleted', 'true');

      const wrapper = getDedicatedIconWrapper(svg, element);
      if (wrapper) {
        wrapper.style.setProperty('display', 'none', 'important');
        wrapper.setAttribute('data-wt-icon-wrapper-hidden', 'true');
      }
    });
    return;
  }

  // If the user selected a replacement icon
  if (iconName && BASIC_ICON_MAP.has(iconName)) {
    const iconOption = BASIC_ICON_MAP.get(iconName)!;

    // If no SVG existed on this element yet, create an inline Lucide-compatible SVG at the start of the element
    if (!primarySvg) {
      const created = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      created.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      created.setAttribute('width', '16');
      created.setAttribute('height', '16');
      created.setAttribute('viewBox', '0 0 24 24');
      created.setAttribute('fill', 'none');
      created.setAttribute('stroke', 'currentColor');
      created.setAttribute('stroke-width', '2');
      created.setAttribute('stroke-linecap', 'round');
      created.setAttribute('stroke-linejoin', 'round');
      created.setAttribute('data-wt-injected-svg', 'true');
      created.style.display = 'inline-block';
      created.style.verticalAlign = 'middle';
      created.style.marginRight = '6px';
      created.style.flexShrink = '0';
      created.innerHTML = iconOption.svgContent;
      element.insertBefore(created, element.firstChild);
      return;
    }

    if (!primarySvg.hasAttribute('data-wt-orig-svg')) {
      primarySvg.setAttribute('data-wt-orig-svg', primarySvg.innerHTML);
    }
    primarySvg.style.removeProperty('display');
    primarySvg.removeAttribute('data-wt-icon-deleted');
    primarySvg.setAttribute('data-wt-icon-name', iconName);
    if (primarySvg.innerHTML !== iconOption.svgContent) {
      primarySvg.innerHTML = iconOption.svgContent;
    }

    const wrapper = getDedicatedIconWrapper(primarySvg, element);
    if (wrapper && wrapper.getAttribute('data-wt-icon-wrapper-hidden') === 'true') {
      wrapper.style.removeProperty('display');
      wrapper.removeAttribute('data-wt-icon-wrapper-hidden');
    }
    return;
  }

  // Otherwise restore original SVGs if they were previously modified or hidden
  svgs.forEach((svg) => {
    if (svg.getAttribute('data-wt-injected-svg') === 'true') {
      svg.remove();
      return;
    }
    const origSvg = svg.getAttribute('data-wt-orig-svg');
    if (origSvg !== null) {
      svg.innerHTML = origSvg;
      svg.removeAttribute('data-wt-orig-svg');
    }
    svg.style.removeProperty('display');
    svg.removeAttribute('data-wt-icon-deleted');
    svg.removeAttribute('data-wt-icon-name');

    const wrapper = getDedicatedIconWrapper(svg, element);
    if (wrapper && wrapper.getAttribute('data-wt-icon-wrapper-hidden') === 'true') {
      wrapper.style.removeProperty('display');
      wrapper.removeAttribute('data-wt-icon-wrapper-hidden');
    }
  });
}
