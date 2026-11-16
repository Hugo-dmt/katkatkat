import React, { useState } from 'react';
import { Post, UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { 
  Heart, 
  MessageCircle, 
  Pin, 
  CheckCircle, 
  ExternalLink, 
  Send,
  Users,
  Bed,
  Bath,
  Sparkles,
  Flame,
  ThumbsUp,
  DollarSign,
  XCircle
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  currentUser: UserProfile;
  onOpenProfileById: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onOpenProfileById,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(post.comments.length > 0);

  const isLiked = post.likes.includes(currentUser.id);

  const handleLike = () => {
    dataService.toggleLikePost(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dataService.addComment(post.id, commentText);
    setCommentText('');
    setShowComments(true);
  };

  const handlePollVote = (optionId: string) => {
    dataService.votePoll(post.id, optionId);
  };

  const handleHouseRating = (rating: 'love' | 'good' | 'meh' | 'pass') => {
    dataService.rateHouse(post.id, rating);
  };

  // Poll calculations
  const totalPollVotes = post.poll
    ? post.poll.options.reduce((acc, opt) => acc + opt.votes.length, 0)
    : 0;

  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className={`post-card ${post.isPinned ? 'pinned' : ''}`}>
      {post.isPinned && (
        <div className="pinned-banner">
          <Pin size={13} />
          <span>Message Épinglé</span>
        </div>
      )}

      {/* Header */}
      <div className="post-header">
        <div className="post-author">
          <img
            src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={post.authorName}
            className="avatar-md"
            onClick={() => onOpenProfileById(post.authorId)}
            style={{ cursor: 'pointer' }}
          />
          <div className="author-info">
            <span 
              className="author-name"
              onClick={() => onOpenProfileById(post.authorId)}
            >
              {post.authorName}
              {post.authorNickname && (
                <span className="author-nickname">({post.authorNickname})</span>
              )}
            </span>
            <span className="post-date">{formattedDate}</span>
          </div>
        </div>

        {/* Badge by type */}
        <div>
          {post.type === 'announcement' && (
            <span className="post-badge badge-announcement">📢 Annonce</span>
          )}
          {post.type === 'poll' && (
            <span className="post-badge badge-poll">📊 Sondage</span>
          )}
          {post.type === 'house' && (
            <span className="post-badge badge-house">🏡 Maison Noël</span>
          )}
          {post.type === 'post' && (
            <span className="post-badge badge-post">💬 Discussion</span>
          )}
        </div>
      </div>

      {/* Content */}
      <h2 className="post-title">{post.title}</h2>
      <div className="post-body">{post.content}</div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {post.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11.5,
                background: 'var(--bg-muted)',
                color: 'var(--text-muted)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* POLL EMBED */}
      {post.poll && (
        <div className="poll-container">
          <div className="poll-question">
            <span>{post.poll.question}</span>
            <span style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 500 }}>
              {totalPollVotes} vote{totalPollVotes > 1 ? 's' : ''}
              {post.poll.allowMultiple ? ' • Choix multiple' : ''}
            </span>
          </div>

          <div className="poll-options-list">
            {post.poll.options.map((opt) => {
              const hasVoted = opt.votes.includes(currentUser.id);
              const percentage =
                totalPollVotes > 0
                  ? Math.round((opt.votes.length / totalPollVotes) * 100)
                  : 0;

              return (
                <button
                  key={opt.id}
                  className={`poll-option-btn ${hasVoted ? 'voted' : ''}`}
                  onClick={() => handlePollVote(opt.id)}
                >
                  <div
                    className="poll-progress-bg"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="poll-option-text">
                    {hasVoted ? (
                      <CheckCircle size={16} color="var(--pine-700)" />
                    ) : (
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          border: '2px solid var(--border-dark)',
                        }}
                      />
                    )}
                    <span>{opt.text}</span>
                  </div>
                  <div className="poll-option-meta">
                    {percentage}% ({opt.votes.length})
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* HOUSE EMBED */}
      {post.house && (
        <div className="house-snippet">
          {post.house.photos && post.house.photos.length > 0 && (
            <div className="house-snippet-header">
              <img
                src={post.house.photos[0]}
                alt={post.house.title}
                className="house-snippet-img"
              />
              <div className="house-snippet-price">
                {post.house.pricePerPerson}€ / pers
                <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.85, marginLeft: 4 }}>
                  ({post.house.priceTotal}€ total)
                </span>
              </div>
            </div>
          )}

          <div className="house-snippet-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                  {post.house.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  📍 {post.house.location}
                </p>
              </div>

              {post.house.url && (
                <a
                  href={post.house.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary btn-sm"
                  style={{ gap: 4 }}
                >
                  <span>Voir l'annonce</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Specs Grid */}
            <div className="house-specs-grid">
              <div className="house-spec-item">
                <Users size={16} color="var(--pine-700)" />
                <span className="spec-val">{post.house.capacity} pers</span>
                <span className="spec-label">Capacité</span>
              </div>
              <div className="house-spec-item">
                <Bed size={16} color="var(--pine-700)" />
                <span className="spec-val">{post.house.bedrooms}</span>
                <span className="spec-label">Chambres</span>
              </div>
              <div className="house-spec-item">
                <Bath size={16} color="var(--pine-700)" />
                <span className="spec-val">{post.house.bathrooms}</span>
                <span className="spec-label">Salles de bain</span>
              </div>
            </div>

            {/* Tags / Amenities */}
            {post.house.tags && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0' }}>
                {post.house.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: 'var(--pine-50)',
                      color: 'var(--pine-800)',
                      fontSize: 11.5,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    ✨ {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Pros & Cons */}
            {(post.house.pros || post.house.cons) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '10px 0', fontSize: 12.5 }}>
                {post.house.pros && post.house.pros.length > 0 && (
                  <div style={{ background: '#f0fbf4', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontWeight: 700, color: '#166534', marginBottom: 4 }}>Points forts :</p>
                    <ul style={{ paddingLeft: 16, color: '#166534' }}>
                      {post.house.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {post.house.cons && post.house.cons.length > 0 && (
                  <div style={{ background: '#fef2f2', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>À savoir :</p>
                    <ul style={{ paddingLeft: 16, color: '#991b1b' }}>
                      {post.house.cons.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Rating Buttons */}
            <div className="house-rating-bar">
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)' }}>
                Votre avis :
              </span>

              <button
                className={`rating-btn ${post.house.ratings?.[currentUser.id] === 'love' ? 'active' : ''}`}
                onClick={() => handleHouseRating('love')}
              >
                <Flame size={14} />
                <span>Coup de cœur</span>
                <span style={{ opacity: 0.8 }}>
                  ({Object.values(post.house.ratings || {}).filter((r) => r === 'love').length})
                </span>
              </button>

              <button
                className={`rating-btn ${post.house.ratings?.[currentUser.id] === 'good' ? 'active' : ''}`}
                onClick={() => handleHouseRating('good')}
              >
                <ThumbsUp size={14} />
                <span>Validé</span>
                <span style={{ opacity: 0.8 }}>
                  ({Object.values(post.house.ratings || {}).filter((r) => r === 'good').length})
                </span>
              </button>

              <button
                className={`rating-btn ${post.house.ratings?.[currentUser.id] === 'meh' ? 'active' : ''}`}
                onClick={() => handleHouseRating('meh')}
              >
                <DollarSign size={14} />
                <span>Trop cher</span>
                <span style={{ opacity: 0.8 }}>
                  ({Object.values(post.house.ratings || {}).filter((r) => r === 'meh').length})
                </span>
              </button>

              <button
                className={`rating-btn ${post.house.ratings?.[currentUser.id] === 'pass' ? 'active' : ''}`}
                onClick={() => handleHouseRating('pass')}
              >
                <XCircle size={14} />
                <span>Passer</span>
                <span style={{ opacity: 0.8 }}>
                  ({Object.values(post.house.ratings || {}).filter((r) => r === 'pass').length})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer / Actions */}
      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes.length > 0 ? `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}` : 'J\'aime'}</span>
        </button>

        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={16} />
          <span>
            {post.comments.length} commentaire{post.comments.length > 1 ? 's' : ''}
          </span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="comments-section">
          {post.comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <img
                src={comment.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={comment.authorName}
                className="avatar-sm"
                onClick={() => onOpenProfileById(comment.authorId)}
                style={{ cursor: 'pointer' }}
              />
              <div className="comment-bubble">
                <div className="comment-author">
                  <span 
                    onClick={() => onOpenProfileById(comment.authorId)}
                    style={{ cursor: 'pointer' }}
                  >
                    {comment.authorName}
                    {comment.authorNickname && ` (${comment.authorNickname})`}
                  </span>
                  <span className="comment-time">
                    {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div>{comment.content}</div>
              </div>
            </div>
          ))}

          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="comment-input-row">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.firstName}
              className="avatar-sm"
            />
            <input
              type="text"
              className="comment-input"
              placeholder="Écrire une réponse pour la colloc..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
