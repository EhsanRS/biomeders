---
layout: page
title: Tags
description: Browse articles by topic.
permalink: /tags/
---

<div class="tags-listing">
{% assign sorted_tags = site.tags | sort %}
{% for tag in sorted_tags %}
  <section id="{{ tag[0] | slugify }}" class="tag-section">
    <h2 class="tag-section__title">
      <span class="tag">{{ tag[0] }}</span>
      <span class="tag-section__count">{{ tag[1].size }} {{ tag[1].size | pluralize: "article", "articles" }}</span>
    </h2>
    <ul class="tag-section__posts">
      {% for post in tag[1] %}
      <li class="tag-section__post">
        <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
      </li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}

{% if site.tags.size == 0 %}
<p class="text-secondary">No tags yet. Check back after some posts are published!</p>
{% endif %}
</div>

<style>
.tags-listing {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.tag-section {
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--border-default);
}

.tag-section:last-child {
  border-bottom: none;
}

.tag-section__title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  font-size: var(--text-xl);
}

.tag-section__count {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  color: var(--text-muted);
}

.tag-section__posts {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.tag-section__post {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-4);
  padding: var(--space-2) 0;
}

.tag-section__post a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: var(--font-medium);
}

.tag-section__post a:hover {
  color: var(--link-color);
}

.tag-section__post time {
  font-size: var(--text-sm);
  color: var(--text-muted);
  white-space: nowrap;
}
</style>
