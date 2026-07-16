import type { Story } from "../data/locations";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="story-card">
      <img src={story.image} alt="" loading="lazy" decoding="async" />
      <div className="story-card__body">
        <p className="story-card__format">{story.format}</p>
        <h4>{story.title}</h4>
        <p>{story.synopsis}</p>
        <a href={story.url} target="_blank" rel="noopener noreferrer">
          {story.buttonLabel}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
