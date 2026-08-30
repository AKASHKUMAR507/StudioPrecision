import { useState } from 'react'
import './StyleShowcase.css'
import { Button } from '../../components/Button/Button'
import { IconButton } from '../../components/IconButton/IconButton'
import { SearchBar } from '../../components/SearchBar/SearchBar'
import { NavBar } from '../../components/NavBar/NavBar'
import { Card } from '../../components/Card/Card'
import { ColorPalette } from '../../components/ColorPalette/ColorPalette'
import { TypeSample } from '../../components/Typography/Typography'
import { SkeletonLines } from '../../components/SkeletonLines/SkeletonLines'
import { EditIcon, TagIcon, TrashIcon, WandIcon, GridIcon, PALETTE, FONTS } from '../../utils/style'

export function StyleShowcase() {
  const [activeNav, setActiveNav] = useState('home')

  return (
    <div className="showcase">
      <aside className="showcase__palette">
        {PALETTE.map((color) => (
          <ColorPalette key={color.name} {...color} />
        ))}
      </aside>

      <main className="showcase__grid">
        {/* Typography */}
        <Card className="showcase__span-2">
          <TypeSample label="Headline" fontName={FONTS.headline} className="text-headline" />
        </Card>
        <Card className="showcase__span-2">
          <TypeSample label="Body" fontName={FONTS.body} className="text-body" />
        </Card>
        <Card className="showcase__span-2">
          <TypeSample label="Label" fontName={FONTS.label} className="text-label" />
        </Card>

        {/* Buttons */}
        <Card>
          <div className="showcase__buttons">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="inverted">Inverted</Button>
            <Button variant="outlined">Outlined</Button>
          </div>
        </Card>
        <Card>
          <Button variant="outlined">
            <EditIcon className="showcase__button-icon" />
            Label
          </Button>
        </Card>

        {/* Inputs & navigation */}
        <Card>
          <SearchBar />
        </Card>
        <Card>
          <NavBar active={activeNav} onSelect={setActiveNav} />
        </Card>
        <Card>
          <SkeletonLines />
        </Card>

        {/* Icon buttons */}
        <Card>
          <IconButton icon={<EditIcon />} tone="ghost" label="Edit" />
        </Card>
        <Card>
          <div className="showcase__icon-row">
            <IconButton icon={<WandIcon />} tone="tertiary" label="Generate" />
            <IconButton icon={<GridIcon />} tone="neutral" label="Layout" />
            <IconButton icon={<TagIcon />} tone="tertiary" label="Tag" />
            <IconButton icon={<TrashIcon />} tone="danger" label="Delete" />
          </div>
        </Card>
      </main>
    </div>
  )
}
