import React, { useState } from 'react';

export const exerciseDatabase = {
    chest: {
        title: 'Chest Day (Push)',
        icon: '🦍',
        exercises: [
            {
                name: 'Barbell Bench Press',
                difficulty: 'Compound',
                muscles: ['Pectorals', 'Front Delts', 'Triceps'],
                steps: [
                    'Lie on the bench with your eyes under the bar.',
                    'Grip the bar slightly wider than shoulder-width.',
                    'Unrack the bar and lower it slowly to your mid-chest.',
                    'Press the bar back up explosively to the starting position.',
                    'Keep your feet planted and your back slightly arched.'
                ],
                tips: 'Do not bounce the bar off your chest. Control the weight.',
                videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg'
            },
            {
                name: 'Incline Dumbbell Press',
                difficulty: 'Intermediate',
                muscles: ['Upper Chest', 'Shoulders'],
                steps: [
                    'Set bench to a 30-45 degree incline.',
                    'Press dumbbells up from shoulder height.',
                    'Lower slowly until you feel a stretch in your chest.',
                    'Press back up, bringing dumbbells close but not touching.'
                ],
                tips: 'Focus on the upper chest squeeze at the top.',
                videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8'
            },
            {
                name: 'Push-Ups',
                difficulty: 'Beginner',
                muscles: ['Chest', 'Core'],
                steps: [
                    'Start in a plank position with hands shoulder-width apart.',
                    'Lower your body until your chest nearly touches the floor.',
                    'Keep your elbows tucked at a 45-degree angle.',
                    'Push back up to the starting position.'
                ],
                tips: 'Keep your body in a straight line. Don\'t let hips sag.',
                videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4'
            }
        ]
    },
    back: {
        title: 'Back Day (Pull)',
        icon: 'cobra',
        exercises: [
            {
                name: 'Deadlift',
                difficulty: 'Advanced',
                muscles: ['Lower Back', 'Hamstrings', 'Glutes', 'Lats'],
                steps: [
                    'Stand with feet hip-width apart, barbell over mid-foot.',
                    'Hinge at hips to grip the bar.',
                    'Keep chest up and back flat.',
                    'Drive through heels to stand up straight.',
                    'Lower the bar with control.'
                ],
                tips: 'Keep the bar close to your shins. Do not round your back.',
                videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q'
            },
            {
                name: 'Pull-Ups',
                difficulty: 'Compound',
                muscles: ['Lats', 'Biceps'],
                steps: [
                    'Hang from a bar with hands slightly wider than shoulders.',
                    'Pull your chest up to the bar.',
                    'Squeeze your shoulder blades together at the top.',
                    'Lower yourself all the way down (dead hang).'
                ],
                tips: 'Use a resistance band if you can\'t do full reps yet.',
                videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g'
            },
            {
                name: 'Bent Over Rows',
                difficulty: 'Intermediate',
                muscles: ['Mid-Back', 'Lats'],
                steps: [
                    'Hold a barbell with palms facing down.',
                    'Bend knees slightly and hinge forward at hips.',
                    'Pull the bar towards your lower chest/upper abs.',
                    'Squeeze your back muscles at the top.'
                ],
                tips: 'Keep your torso stationary; don\'t use momentum.',
                videoUrl: 'https://www.youtube.com/embed/6TSP1TRX5tA'
            }
        ]
    },
    legs: {
        title: 'Leg Day',
        icon: '🦵',
        exercises: [
            {
                name: 'Barbell Squat',
                difficulty: 'Compound',
                muscles: ['Quads', 'Glutes', 'Hamstrings'],
                steps: [
                    'Place bar on upper back (traps).',
                    'Stand with feet shoulder-width apart.',
                    'Push hips back and bend knees to lower yourself.',
                    'Go down until thighs are parallel to the floor.',
                    'Drive back up through your heels.'
                ],
                tips: 'Keep your chest up and knees in line with toes.',
                videoUrl: 'https://www.youtube.com/embed/ultWZbGWL54'
            },
            {
                name: 'Romanian Deadlift',
                difficulty: 'Intermediate',
                muscles: ['Hamstrings', 'Glutes'],
                steps: [
                    'Hold bar at hip level.',
                    'Hinge at hips, pushing butt back.',
                    'Lower bar along legs until you feel a hamstring stretch.',
                    'Squeeze glutes to return to standing.'
                ],
                tips: 'Keep a slight bend in knees but do not squat.',
                videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM'
            },
            {
                name: 'Lunges',
                difficulty: 'Beginner',
                muscles: ['Quads', 'Glutes'],
                steps: [
                    'Step forward with one leg.',
                    'Lower hips until both knees are bent at 90 degrees.',
                    'Push off the front foot to return to start.',
                    'Repeat on the other side.'
                ],
                tips: 'Keep your torso upright.',
                videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U'
            }
        ]
    },
    shoulders: {
        title: 'Shoulders',
        icon: '🥥',
        exercises: [
            {
                name: 'Overhead Press',
                difficulty: 'Compound',
                muscles: ['Front Delts', 'Triceps'],
                steps: [
                    'Stand with bar at collarbone height.',
                    'Press the bar straight up overhead.',
                    'Lock out elbows at the top.',
                    'Lower back down with control.'
                ],
                tips: 'Tighten your core and glutes to avoid arching your back.',
                videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI'
            },
            {
                name: 'Lateral Raises',
                difficulty: 'Isolation',
                muscles: ['Side Delts'],
                steps: [
                    'Hold dumbbells at your sides.',
                    'Raise arms out to the side until shoulder height.',
                    'Lower slowly.',
                    'Keep a slight bend in elbows.'
                ],
                tips: 'Lead with your elbows, not your hands.',
                videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo'
            }
        ]
    },
    cardio: {
        title: 'Cardio & Conditioning',
        icon: '🫀',
        exercises: [
            {
                name: 'HIIT Sprints',
                difficulty: 'High Intensity',
                muscles: ['Heart', 'Legs'],
                steps: [
                    'Warm up for 5 minutes.',
                    'Sprint at 90% effort for 30 seconds.',
                    'Walk or jog slowly for 60 seconds.',
                    'Repeat for 15-20 minutes.'
                ],
                tips: 'Great for fat loss and conditioning.',
                videoUrl: 'https://www.youtube.com/embed/pnrS7l8h89o'
            },
            {
                name: 'Steady State Run',
                difficulty: 'Endurance',
                muscles: ['Heart', 'Legs'],
                steps: [
                    'Run at a conversational pace.',
                    'Maintain this pace for 30-45 minutes.',
                    'Focus on breathing rhythm.'
                ],
                tips: 'Builds aerobic base and recovery capacity.',
                videoUrl: 'https://www.youtube.com/embed/9L2b2khySLE'
            }
        ]
    }
};

const ExerciseLibrary = () => {
    const [activeCategory, setActiveCategory] = useState('chest');

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">📚 Coaching Tutorials</h2>
                <p className="text-gray-600 mt-2">Master your form with our expert guides for every muscle group.</p>
            </div>

            {/* Category Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {Object.entries(exerciseDatabase).map(([key, data]) => (
                    <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 ${activeCategory === key
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {data.icon} {data.title}
                    </button>
                ))}
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exerciseDatabase[activeCategory].exercises.map((exercise, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-gray-50"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{exercise.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {exercise.difficulty}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                            {exercise.muscles.map((m, i) => (
                                <span key={i} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                                    {m}
                                </span>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">📝 Instructions:</h4>
                                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                                    {exercise.steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>

                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                <p className="text-sm text-yellow-800">
                                    <strong>💡 Pro Tip:</strong> {exercise.tips}
                                </p>
                            </div>

                            {exercise.videoUrl && (
                                <div className="mt-3">
                                    <button
                                        onClick={() => window.open(exercise.videoUrl, '_blank')}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        🎥 Watch Tutorial
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExerciseLibrary;
