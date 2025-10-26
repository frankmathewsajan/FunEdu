import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { 
  Calendar, 
  Award, 
  BookOpen, 
  Clock, 
  Target,
  Star
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Activity {
  id: number;
  name: string;
  type: 'lesson' | 'assignment' | 'quiz';
  date: string;
  points: number;
  completed: boolean;
}

interface Course {
  id: number;
  name: string;
  progress: number;
  rank: number;
  totalStudents: number;
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const [userStats] = useState({
    name: user?.full_name || 'Student',
    totalLectures: 300,
    completedLectures: 204,
    totalPoints: 2040,
    currentLevel: 6,
    pointsToNextLevel: 460,
    profilePicture: '👨‍🎓'
  });

  const [activities] = useState<Activity[]>([
    { id: 1, name: 'Genetics Lesson', type: 'lesson', date: 'Jan 2, 19:30', points: 10, completed: false },
    { id: 2, name: 'Math Assignment', type: 'assignment', date: 'Jan 3, 14:00', points: 15, completed: false },
    { id: 3, name: 'Computer Science Quiz', type: 'quiz', date: 'Jan 3, 16:00', points: 20, completed: false },
    { id: 4, name: 'English Course', type: 'lesson', date: 'Jan 4, 10:00', points: 10, completed: false }
  ]);

  const [courses] = useState<Course[]>([
    { id: 1, name: 'Geography', progress: 73, rank: 13, totalStudents: 150 },
    { id: 2, name: 'History', progress: 79, rank: 79, totalStudents: 200 },
    { id: 3, name: 'Biology', progress: 101, rank: 101, totalStudents: 180 }
  ]);

  const [games] = useState([
    { id: 1, name: 'Math Quiz Game', difficulty: 'Easy', points: 50, icon: '🧮' },
    { id: 2, name: 'Word Puzzle', difficulty: 'Medium', points: 75, icon: '🧩' },
    { id: 3, name: 'Science Challenge', difficulty: 'Hard', points: 100, icon: '🔬' }
  ]);

  const completionPercentage = Math.round((userStats.completedLectures / userStats.totalLectures) * 100);
  const levelProgress = Math.round(((userStats.totalPoints % 500) / 500) * 100);

  // Mock calendar data
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  if (isLoading) {
    return (
      <div style={{ 
        background: 'var(--warm-white)', 
        minHeight: '100vh', 
        paddingTop: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div style={{ 
      background: 'var(--warm-white)', 
      minHeight: '100vh', 
      paddingTop: '100px',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <Container fluid className="px-4">
        {/* User Greeting */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm" style={{ 
              background: 'linear-gradient(135deg, var(--light-peach), var(--secondary-peach))',
              borderRadius: '20px'
            }}>
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <div className="me-3" style={{ fontSize: '2.5rem' }}>
                    {userStats.profilePicture}
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: 'var(--text-dark)' }}>Hey {userStats.name},</h3>
                    <p className="mb-0" style={{ color: 'var(--text-light)' }}>It's sunny today and it's time to study 📚</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Left Column */}
          <Col lg={8}>
            <Row>
              {/* Progress Stats Combined - Stacked Vertically */}
              <Col md={4}>
                <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '15px' }}>
                  <Card.Header className="bg-transparent border-0 p-3 pb-0">
                    <h6 className="mb-0" style={{ fontSize: '14px' }}>Progress</h6>
                  </Card.Header>
                  <Card.Body className="p-3">
                    {/* Completed Lessons */}
                    <div className="text-center mb-3">
                      <h5 className="mb-1" style={{ fontSize: '18px', color: 'var(--accent-coral)' }}>
                        {userStats.completedLectures}/{userStats.totalLectures}
                      </h5>
                      <p className="text-muted mb-2" style={{ fontSize: '12px' }}>Completed lessons</p>
                      <ProgressBar 
                        now={completionPercentage} 
                        style={{ height: '8px', borderRadius: '10px' }}
                        variant="warning"
                      />
                      <small className="text-muted" style={{ fontSize: '11px' }}>{completionPercentage}% Complete</small>
                    </div>
                    
                    <hr style={{ margin: '12px 0', opacity: '0.2' }} />
                    
                    {/* Total Points */}
                    <div className="text-center">
                      <h5 className="mb-1" style={{ fontSize: '18px', color: 'var(--accent-coral)' }}>
                        {userStats.totalPoints} pts
                      </h5>
                      <p className="text-muted mb-2" style={{ fontSize: '12px' }}>Total Points</p>
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <Star fill="var(--accent-coral)" color="var(--accent-coral)" size={14} className="me-1" />
                        <span style={{ fontSize: '12px' }}>Level {userStats.currentLevel}</span>
                      </div>
                      <ProgressBar 
                        now={levelProgress} 
                        style={{ height: '6px', borderRadius: '10px' }}
                        variant="info"
                      />
                      <small className="text-muted" style={{ fontSize: '11px' }}>{userStats.pointsToNextLevel} pts to next level</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Activity Section - Moved to First Row */}
              <Col md={8}>
                <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '15px' }}>
                  <Card.Header className="bg-transparent border-0 p-3 pb-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0" style={{ fontSize: '14px' }}>Recent Activity</h6>
                      <Badge bg="secondary" style={{ borderRadius: '12px', fontSize: '11px' }}>
                        {activities.length}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-3">
                    <Row>
                      {activities.map(activity => (
                        <Col md={6} key={activity.id} className="mb-3">
                          <div className="p-3 rounded border" 
                               style={{ 
                                 background: activity.type === 'lesson' ? 'var(--light-peach)' : 
                                            activity.type === 'assignment' ? 'var(--accent-lavender)' : 
                                            'var(--secondary-peach)',
                                 borderColor: activity.type === 'lesson' ? 'var(--accent-coral)' : 
                                             activity.type === 'assignment' ? 'var(--accent-pink)' : 
                                             'var(--primary-peach)',
                                 borderWidth: '1px',
                                 borderStyle: 'solid'
                               }}>
                            <div className="d-flex align-items-start justify-content-between">
                              <div className="d-flex align-items-start">
                                <div className="me-3 mt-1">
                                  {activity.type === 'lesson' && <BookOpen size={20} style={{ color: 'var(--accent-coral)' }} />}
                                  {activity.type === 'assignment' && <Target size={20} style={{ color: 'var(--accent-pink)' }} />}
                                  {activity.type === 'quiz' && <Award size={20} style={{ color: '#8B5CF6' }} />}
                                </div>
                                <div>
                                  <div className="fw-semibold mb-1" style={{ fontSize: '14px' }}>
                                    {activity.name}
                                  </div>
                                  <div className="text-muted mb-1" style={{ fontSize: '12px' }}>
                                    {activity.date}
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <span className="badge me-2" 
                                          style={{ 
                                            background: activity.type === 'lesson' ? 'var(--accent-coral)' : 
                                                       activity.type === 'assignment' ? 'var(--accent-pink)' : '#8B5CF6',
                                            color: 'white',
                                            fontSize: '10px',
                                            textTransform: 'capitalize'
                                          }}>
                                      {activity.type}
                                    </span>
                                    <span className="text-muted" style={{ fontSize: '11px' }}>
                                      {activity.completed ? 'Completed' : 'Pending'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-end">
                                <Badge 
                                  bg={activity.completed ? 'success' : 'warning'} 
                                  style={{ borderRadius: '8px', fontSize: '11px' }}>
                                  +{activity.points} pts
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Courses and Games Row */}
            <Row>
              <Col md={8}>
                {/* Courses Section with Big Donut Charts */}
                <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '15px' }}>
                  <Card.Header className="bg-transparent border-0 p-3 pb-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0" style={{ fontSize: '14px' }}>Courses</h6>
                      <Badge bg="secondary" style={{ borderRadius: '12px', fontSize: '11px' }}>
                        {courses.length}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-3">
                    <Row>
                      {courses.map(course => (
                        <Col md={4} key={course.id} className="mb-3">
                          <div className="text-center p-3 rounded" style={{ background: 'var(--soft-gray)' }}>
                            <div className="mb-2 d-flex justify-content-center">
                              <div className="position-relative">
                                {/* Outer Ring */}
                                <div 
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ 
                                    width: '80px', 
                                    height: '80px', 
                                    background: `conic-gradient(var(--accent-coral) ${course.progress * 3.6}deg, #e9ecef 0deg)`,
                                    padding: '4px'
                                  }}>
                                  {/* Inner Ring */}
                                  <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ 
                                      width: '65px', 
                                      height: '65px', 
                                      background: `conic-gradient(var(--accent-pink) ${(course.progress * 0.8) * 3.6}deg, #f8f9fa 0deg)`,
                                      padding: '3px'
                                    }}>
                                    {/* Center Circle */}
                                    <div 
                                      className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                                      style={{ width: '50px', height: '50px' }}>
                                      <div className="text-center">
                                        <div className="fw-bold" style={{ fontSize: '12px', color: 'var(--accent-coral)' }}>
                                          {course.progress}%
                                        </div>
                                        <div style={{ fontSize: '8px', color: 'var(--text-light)' }}>
                                          #{course.rank}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Progress Label */}
                                <div 
                                  className="position-absolute rounded-pill px-2"
                                  style={{ 
                                    bottom: '-8px', 
                                    left: '50%', 
                                    transform: 'translateX(-50%)',
                                    background: 'var(--accent-coral)',
                                    fontSize: '8px',
                                    color: 'white'
                                  }}>
                                  TOP {Math.round((course.rank / course.totalStudents) * 100)}%
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="fw-semibold" style={{ fontSize: '14px' }}>{course.name}</div>
                              <small className="text-muted" style={{ fontSize: '12px' }}>
                                Rank #{course.rank} of {course.totalStudents}
                              </small>
                            </div>
                            
                            <div className="mt-2">
                              <div className="d-flex justify-content-between text-center">
                                <div>
                                  <div className="fw-bold" style={{ fontSize: '12px', color: 'var(--accent-coral)' }}>
                                    {Math.round(course.progress * 0.8)}%
                                  </div>
                                  <small style={{ fontSize: '11px', color: 'var(--text-light)' }}>Completed</small>
                                </div>
                                <div>
                                  <div className="fw-bold" style={{ fontSize: '12px', color: 'var(--accent-pink)' }}>
                                    {100 - Math.round(course.progress * 0.8)}%
                                  </div>
                                  <small style={{ fontSize: '11px', color: 'var(--text-light)' }}>Remaining</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                {/* Games Section */}
                <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '15px' }}>
                  <Card.Header className="bg-transparent border-0 p-3 pb-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0" style={{ fontSize: '14px' }}>Games</h6>
                      <Badge bg="secondary" style={{ borderRadius: '12px', fontSize: '11px' }}>
                        {games.length}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-3">
                    {games.map(game => (
                      <div key={game.id} className="d-flex align-items-center justify-content-between p-2 mb-2 rounded"
                           style={{ background: 'var(--accent-lavender)' }}>
                        <div className="d-flex align-items-center">
                          <div className="me-2" style={{ fontSize: '18px' }}>
                            {game.icon}
                          </div>
                          <div>
                            <div className="fw-semibold" style={{ fontSize: '14px' }}>{game.name}</div>
                            <small className="text-muted" style={{ fontSize: '12px' }}>{game.difficulty}</small>
                          </div>
                        </div>
                        <Badge bg="success" style={{ borderRadius: '8px', fontSize: '11px' }}>
                          {game.points} pts
                        </Badge>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Right Column */}
          <Col lg={4}>
            {/* Scheduled Section */}
            <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '15px' }}>
              <Card.Header className="bg-transparent border-0 p-3 pb-0">
                <h6 className="mb-0" style={{ fontSize: '14px' }}>Scheduled</h6>
              </Card.Header>
              <Card.Body className="p-3">
                {/* Calendar */}
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <Calendar size={18} className="me-2" style={{ color: 'var(--accent-coral)' }} />
                      <span className="fw-semibold" style={{ fontSize: '14px' }}>{currentMonth}</span>
                    </div>
                    <div className="d-flex">
                      <button className="btn btn-sm btn-outline-secondary me-1" style={{ fontSize: '12px', padding: '2px 8px' }}>‹</button>
                      <button className="btn btn-sm btn-outline-secondary" style={{ fontSize: '12px', padding: '2px 8px' }}>›</button>
                    </div>
                  </div>
                  
                  {/* Calendar Header */}
                  <div className="row g-0 mb-2 border-bottom pb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <div key={index} className="col text-center">
                        <div className="fw-semibold text-muted" style={{ fontSize: '12px' }}>{day}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="calendar-grid">
                    {Array.from({ length: 6 }, (_, weekIndex) => (
                      <div key={weekIndex} className="row g-0">
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const dayNumber = weekIndex * 7 + dayIndex - 2; // Start from day -2 to show previous month
                          const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
                          const isToday = dayNumber === 15;
                          const hasEvent = [3, 7, 15, 22, 28].includes(dayNumber);
                          
                          return (
                            <div key={dayIndex} className="col text-center">
                              <div 
                                className={`calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}
                                style={{ 
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  padding: '8px 4px',
                                  margin: '1px',
                                  borderRadius: '6px',
                                  background: isToday ? 'var(--accent-coral)' : 
                                             hasEvent ? 'var(--light-peach)' : 'transparent',
                                  color: isToday ? 'white' : 
                                         !isCurrentMonth ? '#ccc' : 'var(--text-dark)',
                                  fontWeight: isToday ? 'bold' : 'normal',
                                  border: hasEvent && !isToday ? '1px solid var(--accent-coral)' : '1px solid transparent',
                                  minHeight: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative'
                                }}>
                                {isCurrentMonth ? dayNumber : dayNumber <= 0 ? 30 + dayNumber : dayNumber - 31}
                                {hasEvent && (
                                  <div 
                                    style={{
                                      position: 'absolute',
                                      bottom: '2px',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      width: '4px',
                                      height: '4px',
                                      borderRadius: '50%',
                                      background: isToday ? 'white' : 'var(--accent-coral)'
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming */}
                <div>
                  <div className="d-flex align-items-center mb-3">
                    <Clock size={16} className="me-2" style={{ color: 'var(--accent-coral)' }} />
                    <span className="fw-semibold" style={{ fontSize: '14px' }}>Upcoming Events</span>
                  </div>
                  <div className="mb-2 p-3 rounded border-start" 
                       style={{ 
                         background: 'var(--light-peach)', 
                         borderLeftColor: 'var(--accent-coral)',
                         borderLeftWidth: '3px'
                       }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '14px' }}>Course Name: Lesson</div>
                        <small className="text-muted" style={{ fontSize: '12px' }}>Jan 4, 09:00 AM</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold" style={{ fontSize: '12px', color: 'var(--accent-coral)' }}>09:00</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 p-3 rounded border-start" 
                       style={{ 
                         background: 'var(--light-peach)', 
                         borderLeftColor: 'var(--accent-pink)',
                         borderLeftWidth: '3px'
                       }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '14px' }}>Course Name: Test</div>
                        <small className="text-muted" style={{ fontSize: '12px' }}>Jan 4, 10:00 AM</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold" style={{ fontSize: '12px', color: 'var(--accent-pink)' }}>10:00</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded border-start" 
                       style={{ 
                         background: 'var(--accent-lavender)', 
                         borderLeftColor: '#8B5CF6',
                         borderLeftWidth: '3px'
                       }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '14px' }}>Extracurricular Activities</div>
                        <small className="text-muted" style={{ fontSize: '12px' }}>Apr 2, 03:00 PM</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold" style={{ fontSize: '12px', color: '#8B5CF6' }}>15:00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;