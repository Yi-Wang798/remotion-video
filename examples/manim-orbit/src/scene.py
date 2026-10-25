from manim import Scene, Circle, Dot, Line, TracedPath, ValueTracker, Create, FadeIn, linear, config
import numpy as np

config.pixel_width = 1280
config.pixel_height = 720
config.background_color = "#FAF7F0"

class Orbit(Scene):
    def construct(self):
        center = np.array([0.0, -0.45, 0.0])
        radius = 2.0
        circle = Circle(radius=radius, color="#DCE0E3", stroke_width=4).move_to(center)
        angle = ValueTracker(0)
        point = lambda: center + radius * np.array([np.cos(angle.get_value()), np.sin(angle.get_value()), 0])
        dot = Dot(point(), radius=0.11, color="#C97948")
        dot.add_updater(lambda m: m.move_to(point()))
        arm = Line(center, point(), color="#101E38", stroke_width=4)
        arm.add_updater(lambda m: m.put_start_and_end_on(center, point()))
        trace = TracedPath(dot.get_center, stroke_color="#2B877F", stroke_width=6)
        self.play(Create(circle), run_time=0.8)
        self.play(FadeIn(arm), FadeIn(dot), run_time=0.4)
        self.add(trace)
        self.play(angle.animate.set_value(2*np.pi), run_time=4, rate_func=linear)
        self.wait(0.8)
